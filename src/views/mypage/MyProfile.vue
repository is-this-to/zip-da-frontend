<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router"; // router.push 사용하려면 꼭 필요
import { useAuthStore } from "../../store/auth/useAuthStore";
import {
  getMyProfile,
  updateMyProfile,
  uploadAgentProfileImage,
} from "../../api/myPageApi";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const message = ref("");
const errorMessage = ref("");

const passwordModalOpen = ref(false); // 비밀번호 변경 모달 열림 여부
const withdrawModalOpen = ref(false); // 회원탈퇴 모달 열림 여부

const photoUrl = ref("");
const selectedPhotoFile = ref(null);

const form = reactive({
  name: "",
  nick: "",
  email: "",
  phone: "",
  role: "", // isAgent에서 사용하니까 처음부터 넣어주는 게 안전함
});

let initialForm = "";
let initialPhotoUrl = ""; // 취소 눌렀을 때 기존 사진으로 되돌리기 위해 필요

const isAgent = computed(() => {
  return authStore.role === "AGENT" || form.role === "AGENT";
});

const handleLogout = async () => {
  await authStore.logout();
  router.push("/main");
};

const fillForm = (data = {}) => {
  Object.assign(form, {
    name: data.name ?? "",
    nick: data.nick ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    role: data.role ?? authStore.role,
  });

  photoUrl.value = data.profileImageUrl ?? "";
  initialPhotoUrl = photoUrl.value; // 처음 불러온 사진 저장
  selectedPhotoFile.value = null;
  initialForm = JSON.stringify(form);
};

const loadProfile = async () => {
  try {
    const result = await getMyProfile();
    fillForm(result.data);
  } catch (error) {
    fillForm(authStore.userInfo || {});
    errorMessage.value =
      error.response?.data?.message ||
      "내 정보 조회 API 연결 전입니다. 로그인 정보로 임시 표시합니다.";
  } finally {
    loading.value = false;
  }
};

const choosePhoto = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = "프로필 이미지는 10MB 이하만 등록할 수 있습니다.";
    return;
  }

  selectedPhotoFile.value = file;
  photoUrl.value = URL.createObjectURL(file);
  message.value =
    "사진 미리보기가 적용되었습니다. 저장하기를 눌러야 반영됩니다.";
};

const deletePhoto = () => {
  photoUrl.value = "";
  selectedPhotoFile.value = null;
  message.value = "프로필 사진이 삭제되었습니다. 저장하기를 눌러야 반영됩니다.";
};

const resetForm = () => {
  Object.assign(form, JSON.parse(initialForm));
  photoUrl.value = initialPhotoUrl; // 기존 사진으로 복구
  selectedPhotoFile.value = null;
  message.value = "변경 내용을 되돌렸습니다.";
  errorMessage.value = "";
};

const saveProfile = async () => {
  errorMessage.value = "";
  message.value = "";

  if (!form.name.trim()) {
    errorMessage.value = "이름을 입력해 주세요.";
    return;
  }

  if (!form.nick.trim()) {
    errorMessage.value = "닉네임을 입력해 주세요.";
    return;
  }

  try {
    saving.value = true;

    let uploadedImageUrl = photoUrl.value;

    if (isAgent.value && selectedPhotoFile.value) {
      const uploadResult = await uploadAgentProfileImage(
        selectedPhotoFile.value,
      );
      uploadedImageUrl = uploadResult.data?.fileUri ?? "";
    }

    const updatePayload = {
      name: form.name,
      nick: form.nick,
      phone: form.phone,
    };

    // 공인중개사일 때만 프로필 이미지 주소를 보냄
    if (isAgent.value) {
      updatePayload.profileImageUrl = uploadedImageUrl;
    }

    const result = await updateMyProfile(updatePayload);
    fillForm(result.data ?? updatePayload);

    if (authStore.userInfo) {
      Object.assign(authStore.userInfo, result.data ?? updatePayload);
    }

    message.value = "내 정보가 저장되었습니다.";
  } catch (error) {
    errorMessage.value =
      error.response?.data?.data ||
      error.response?.data?.message ||
      "저장하지 못했습니다. 서버 연결을 확인해 주세요.";
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div class="page-head">
    <span>MY PROFILE</span>
    <h1>프로필 수정</h1>
    <p>ZIPDA에서 사용할 내 정보를 확인하고 관리하세요.</p>
  </div>

  <div v-if="loading" class="state-card">프로필을 불러오는 중입니다…</div>

  <form v-else class="profile-form" @submit.prevent="saveProfile">
    <!-- 공인중개사만 프로필 사진 영역 표시 -->
    <section v-if="isAgent" class="photo-card">
      <div
        class="photo"
        :style="photoUrl ? { backgroundImage: `url(${photoUrl})` } : {}"
      >
        <span v-if="!photoUrl">{{ form.nick?.slice(0, 1) || "Z" }}</span>
      </div>

      <div>
        <h2>프로필 사진</h2>

        <div class="photo-actions">
          <label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="choosePhoto"
            />
            사진 변경
          </label>
          <button type="button" @click="deletePhoto">삭제</button>
        </div>
      </div>
    </section>

    <section class="form-card">
      <div class="form-grid">
        <label>
          <span>이름</span>
          <input v-model="form.name" autocomplete="name" placeholder="이름" />
        </label>

        <label>
          <span>닉네임</span>
          <input v-model="form.nick" placeholder="닉네임" />
        </label>

        <label>
          <span>이메일</span>
          <input v-model="form.email" type="email" disabled />
          <small>이메일은 변경할 수 없습니다.</small>
        </label>

        <label>
          <span>휴대폰 번호</span>
          <input
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="010-1234-5678"
          />
        </label>
      </div>
    </section>

    <p v-if="message" class="notice success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="notice error" role="alert">
      {{ errorMessage }}
    </p>
    <div class="form-actions">
      <button type="button" class="secondary" @click="resetForm">취소</button>

      <button class="primary" :disabled="saving">
        {{ saving ? "저장 중…" : "저장하기" }}
      </button>
    </div>

    <div class="profile-buttons">
      <button
        type="button"
        class="setting-row"
        @click="passwordModalOpen = true"
      >
        <span class="setting-icon">🔒</span>
        <strong>비밀번호 변경</strong>
      </button>

      <button type="button" class="setting-row" @click="handleLogout">
        <span class="setting-icon">↪</span>
        <strong>로그아웃</strong>
      </button>

      <button
        type="button"
        class="setting-row danger-row"
        @click="withdrawModalOpen = true"
      >
        <span class="setting-icon">⚠</span>
        <strong>회원 탈퇴</strong>
      </button>
    </div>
  </form>
</template>

<style scoped>
.page-head {
  margin-bottom: 24px;
}

.page-head span {
  color: #0064ff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.page-head h1 {
  margin: 8px 0;
  font-size: 30px;
}

.page-head p {
  color: #7b8494;
  font-size: 14px;
}

.state-card,
.photo-card,
.form-card {
  border: 1px solid #ebedf3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(26, 39, 71, 0.04);
}

.state-card {
  padding: 50px;
  text-align: center;
  color: #737c8c;
}

.profile-form {
  display: grid;
  gap: 18px;
}

.photo-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 22px;
}

.photo {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: linear-gradient(145deg, #cbdaf5, #e8effb);
  background-size: cover;
  background-position: center;
  color: #0064ff;
  font-size: 30px;
  font-weight: 900;
}

.photo-card h2 {
  margin-bottom: 5px;
  font-size: 16px;
}

.photo-actions {
  display: flex;
  gap: 8px;
  margin-top: 13px;
}

.photo-actions label,
.photo-actions button {
  padding: 8px 12px;
  border: 1px solid #dfe4ec;
  border-radius: 7px;
  color: #455166;
  background: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.photo-actions label {
  color: #0064ff;
  border-color: #b9d2ff;
}

.photo-actions input {
  display: none;
}

.form-card {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-grid label > span {
  color: #596274;
  font-size: 12px;
  font-weight: 800;
}

.form-grid input {
  width: 100%;
  height: 45px;
  padding: 0 13px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  outline: none;
  color: #263247;
  background: #f8f9fd;
  font: inherit;
}

.form-grid input:focus {
  border-color: #0064ff;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
  background: #fff;
}

.form-grid input:disabled {
  color: #8d96a6;
  cursor: not-allowed;
}

.form-grid small {
  color: #a0a7b5;
  font-size: 10px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}

.form-actions button {
  height: 42px;
  padding: 0 22px;
  border: 0;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
}

.secondary {
  color: #6d7686;
  background: #e9ecf2;
}

.primary {
  color: #fff;
  background: #0064ff;
  box-shadow: 0 7px 16px rgba(0, 100, 255, 0.18);
}

.primary:disabled {
  opacity: 0.6;
}

.notice {
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 12px;
}

.success {
  color: #087a4b;
  background: #e8f8f0;
}

.error {
  color: #bd2635;
  background: #fff0f1;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .photo-card {
    align-items: flex-start;
  }

  .form-actions button {
    flex: 1;
  }
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid #e4e8f0;
  border-radius: 10px;
  background: #fff;
  color: #263247;
  font: inherit;
  cursor: pointer;
}

.setting-row + .setting-row {
  margin-top: 10px;
}

.setting-row strong {
  font-size: 14px;
}

.setting-icon {
  width: 28px;
  text-align: center;
}

.danger-row {
  color: #bd2635;
  border-color: #ffd5da;
  background: #fff7f8;
}
</style>
