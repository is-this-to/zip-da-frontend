<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth/useAuthStore";
import MyInput from "../../components/input/MyInput.vue";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  uploadAgentProfileImage,
  withdrawMembership,
} from "../../api/myPageApi";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const message = ref("");
const errorMessage = ref("");
const withdrawErrorMessage = ref("");

const passwordModalOpen = ref(false); // 비밀번호 변경 모달 열림 여부
const withdrawModalOpen = ref(false); // 회원탈퇴 모달 열림 여부
const withdrawCompleteModalOpen = ref(false); // 회원탈퇴 완료 모달 열림 여부
const modalLoading = ref(false);

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const withdrawPassword = ref("");

const photoUrl = ref("");
const selectedPhotoFile = ref(null);

const form = reactive({
  name: "",
  nick: "",
  email: "",
  phone: "",
  role: "",
});

let initialForm = "";
let initialPhotoUrl = "";

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
  initialPhotoUrl = photoUrl.value;
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
  photoUrl.value = initialPhotoUrl;
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

const closePasswordModal = () => {
  passwordModalOpen.value = false;

  Object.assign(passwordForm, {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
};

const submitPasswordChange = async () => {
  message.value = "";
  errorMessage.value = "";

  if (!passwordForm.currentPassword) {
    errorMessage.value = "현재 비밀번호를 입력해 주세요.";
    return;
  }

  if (!passwordForm.newPassword) {
    errorMessage.value = "새 비밀번호를 입력해 주세요.";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
    errorMessage.value = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    modalLoading.value = true;

    await updateMyPassword({ ...passwordForm });

    closePasswordModal();
    message.value = "비밀번호가 변경되었습니다.";
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "비밀번호를 변경하지 못했습니다.";
  } finally {
    modalLoading.value = false;
  }
};

const closeWithdrawModal = () => {
  // 회원탈퇴 모달 닫기
  withdrawModalOpen.value = false;

  // 입력한 비밀번호 초기화
  withdrawPassword.value = "";

  // 회원탈퇴 모달 에러 메시지 초기화
  withdrawErrorMessage.value = "";
};

const submitWithdraw = async () => {
  // 전체 성공/에러 메시지 초기화
  message.value = "";
  errorMessage.value = "";

  // 회원탈퇴 모달 안에서 보여줄 에러 메시지 초기화
  withdrawErrorMessage.value = "";

  // 비밀번호 입력 안 했을 때
  if (!withdrawPassword.value) {
    withdrawErrorMessage.value =
      "회원탈퇴를 진행하려면 비밀번호를 입력해 주세요.";
    return;
  }

  // 최종 확인창
  if (!confirm("정말로 회원탈퇴를 진행하시겠습니까?")) {
    return;
  }

  try {
    // 버튼 로딩 시작
    modalLoading.value = true;

    // 서버에 회원탈퇴 요청
    await withdrawMembership(withdrawPassword.value);

    // 성공했을 때만 탈퇴 모달 닫기
    closeWithdrawModal();

    // 탈퇴 완료 모달 열기
    withdrawCompleteModalOpen.value = true;
  } catch (error) {
    // 인증 실패일 때
    if (error.response?.status === 401) {
      withdrawErrorMessage.value =
        "로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
      return;
    }

    // 그 외 서버 에러 메시지
    withdrawErrorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.data ||
      "회원탈퇴를 처리하지 못했습니다. 비밀번호 또는 탈퇴 가능 상태를 확인해 주세요.";
  } finally {
    // 성공/실패 상관없이 로딩 종료
    modalLoading.value = false;
  }
};

const moveMainAfterWithdraw = () => {
  withdrawCompleteModalOpen.value = false;
  authStore.clearAuthStore();
  router.push("/main");
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
        <MyInput
          v-model="form.name"
          content="이름"
          placeholder="이름"
          auth-complete="name"
          :required="true"
        />

        <MyInput
          v-model="form.nick"
          content="닉네임"
          placeholder="닉네임"
          :required="true"
        />

        <MyInput
          v-model="form.email"
          input-type="email"
          content="이메일"
          :disabled="true"
          help-text="이메일은 변경할 수 없습니다."
        />

        <MyInput
          v-model="form.phone"
          input-type="tel"
          content="휴대폰 번호"
          placeholder="010-1234-5678"
          auth-complete="tel"
        />
      </div>
    </section>

    <p v-if="message" class="notice success" role="status">
      {{ message }}
    </p>

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

  <div
    v-if="passwordModalOpen"
    class="modal-backdrop"
    @click.self="closePasswordModal"
  >
    <section class="modal-card">
      <button class="modal-close" type="button" @click="closePasswordModal">
        ×
      </button>

      <h2>비밀번호 변경</h2>
      <p>현재 비밀번호 확인 후 새 비밀번호로 변경합니다.</p>

      <form @submit.prevent="submitPasswordChange">
        <MyInput
          v-model="passwordForm.currentPassword"
          input-type="password"
          content="현재 비밀번호"
          placeholder="현재 비밀번호"
          auth-complete="current-password"
        />

        <MyInput
          v-model="passwordForm.newPassword"
          input-type="password"
          content="새 비밀번호"
          placeholder="새 비밀번호"
          auth-complete="new-password"
        />

        <MyInput
          v-model="passwordForm.newPasswordConfirm"
          input-type="password"
          content="새 비밀번호 확인"
          placeholder="새 비밀번호 확인"
          auth-complete="new-password"
        />

        <button class="modal-primary" type="submit" :disabled="modalLoading">
          {{ modalLoading ? "처리 중…" : "변경하기" }}
        </button>
      </form>
    </section>
  </div>

  <div
    v-if="withdrawModalOpen"
    class="modal-backdrop"
    @click.self="closeWithdrawModal"
  >
    <section class="modal-card">
      <button class="modal-close" type="button" @click="closeWithdrawModal">
        ×
      </button>

      <h2>회원 탈퇴</h2>
      <p>본인 확인을 위해 비밀번호를 입력해 주세요.</p>

      <form @submit.prevent="submitWithdraw">
        <MyInput
          v-model="withdrawPassword"
          input-type="password"
          content="비밀번호"
          placeholder="비밀번호"
          auth-complete="current-password"
        />

        <p v-if="withdrawErrorMessage" class="notice error" role="alert">
          {{ withdrawErrorMessage }}
        </p>

        <button class="modal-danger" type="submit" :disabled="modalLoading">
          {{ modalLoading ? "처리 중…" : "탈퇴하기" }}
        </button>
      </form>
    </section>
  </div>

  <div
    v-if="withdrawCompleteModalOpen"
    class="modal-backdrop"
    @click.self="moveMainAfterWithdraw"
  >
    <section class="modal-card">
      <h2>회원 탈퇴 완료</h2>
      <p>회원탈퇴가 완료되었습니다.</p>

      <button
        class="modal-primary"
        type="button"
        @click="moveMainAfterWithdraw"
      >
        확인
      </button>
    </section>
  </div>
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(24, 34, 51, 0.55);
}

.modal-card {
  position: relative;
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(19, 32, 56, 0.2);
}

.modal-card h2 {
  margin-bottom: 8px;
  color: #263247;
}

.modal-card p {
  margin-bottom: 16px;
  color: #7b8494;
  font-size: 13px;
}

.modal-card input {
  width: 100%;
  height: 42px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  outline: none;
}

.modal-card input:focus {
  border-color: #0064ff;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 15px;
  border: 0;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.modal-primary,
.modal-danger {
  width: 100%;
  height: 42px;
  margin-top: 14px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.modal-primary {
  background: #0064ff;
}

.modal-danger {
  background: #dc3548;
}

.modal-primary:disabled,
.modal-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth/useAuthStore";
import MyInput from "../../components/input/MyInput.vue";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  uploadAgentProfileImage,
  withdrawMembership,
} from "../../api/myPageApi";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const message = ref("");
const errorMessage = ref("");
const withdrawErrorMessage = ref("");

const passwordModalOpen = ref(false); // 비밀번호 변경 모달 열림 여부
const withdrawModalOpen = ref(false); // 회원탈퇴 모달 열림 여부
const withdrawCompleteModalOpen = ref(false); // 회원탈퇴 완료 모달 열림 여부
const modalLoading = ref(false);

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const withdrawPassword = ref("");

const photoUrl = ref("");
const selectedPhotoFile = ref(null);

const form = reactive({
  name: "",
  nick: "",
  email: "",
  phone: "",
  role: "",
});

let initialForm = "";
let initialPhotoUrl = "";

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
  initialPhotoUrl = photoUrl.value;
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
  photoUrl.value = initialPhotoUrl;
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

const closePasswordModal = () => {
  passwordModalOpen.value = false;

  Object.assign(passwordForm, {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
};

const submitPasswordChange = async () => {
  message.value = "";
  errorMessage.value = "";

  if (!passwordForm.currentPassword) {
    errorMessage.value = "현재 비밀번호를 입력해 주세요.";
    return;
  }

  if (!passwordForm.newPassword) {
    errorMessage.value = "새 비밀번호를 입력해 주세요.";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
    errorMessage.value = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    modalLoading.value = true;

    await updateMyPassword({ ...passwordForm });

    closePasswordModal();
    message.value = "비밀번호가 변경되었습니다.";
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "비밀번호를 변경하지 못했습니다.";
  } finally {
    modalLoading.value = false;
  }
};

const closeWithdrawModal = () => {
  // 회원탈퇴 모달 닫기
  withdrawModalOpen.value = false;

  // 입력한 비밀번호 초기화
  withdrawPassword.value = "";

  // 회원탈퇴 모달 에러 메시지 초기화
  withdrawErrorMessage.value = "";
};

const submitWithdraw = async () => {
  // 전체 성공/에러 메시지 초기화
  message.value = "";
  errorMessage.value = "";

  // 회원탈퇴 모달 안에서 보여줄 에러 메시지 초기화
  withdrawErrorMessage.value = "";

  // 비밀번호 입력 안 했을 때
  if (!withdrawPassword.value) {
    withdrawErrorMessage.value =
      "회원탈퇴를 진행하려면 비밀번호를 입력해 주세요.";
    return;
  }

  // 최종 확인창
  if (!confirm("정말로 회원탈퇴를 진행하시겠습니까?")) {
    return;
  }

  try {
    // 버튼 로딩 시작
    modalLoading.value = true;

    // 서버에 회원탈퇴 요청
    await withdrawMembership(withdrawPassword.value);

    // 성공했을 때만 탈퇴 모달 닫기
    closeWithdrawModal();

    // 탈퇴 완료 모달 열기
    withdrawCompleteModalOpen.value = true;
  } catch (error) {
    // 인증 실패일 때
    if (error.response?.status === 401) {
      withdrawErrorMessage.value =
        "로그인 정보가 만료되었습니다. 다시 로그인해 주세요.";
      return;
    }

    // 그 외 서버 에러 메시지
    withdrawErrorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.data ||
      "회원탈퇴를 처리하지 못했습니다. 비밀번호 또는 탈퇴 가능 상태를 확인해 주세요.";
  } finally {
    // 성공/실패 상관없이 로딩 종료
    modalLoading.value = false;
  }
};

const moveMainAfterWithdraw = () => {
  withdrawCompleteModalOpen.value = false;
  authStore.clearAuthStore();
  router.push("/main");
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
        <MyInput
          v-model="form.name"
          content="이름"
          placeholder="이름"
          auth-complete="name"
          :required="true"
        />

        <MyInput
          v-model="form.nick"
          content="닉네임"
          placeholder="닉네임"
          :required="true"
        />

        <MyInput
          v-model="form.email"
          input-type="email"
          content="이메일"
          :disabled="true"
          help-text="이메일은 변경할 수 없습니다."
        />

        <MyInput
          v-model="form.phone"
          input-type="tel"
          content="휴대폰 번호"
          placeholder="010-1234-5678"
          auth-complete="tel"
        />
      </div>
    </section>

    <p v-if="message" class="notice success" role="status">
      {{ message }}
    </p>

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

  <div
    v-if="passwordModalOpen"
    class="modal-backdrop"
    @click.self="closePasswordModal"
  >
    <section class="modal-card">
      <button class="modal-close" type="button" @click="closePasswordModal">
        ×
      </button>

      <h2>비밀번호 변경</h2>
      <p>현재 비밀번호 확인 후 새 비밀번호로 변경합니다.</p>

      <form @submit.prevent="submitPasswordChange">
        <MyInput
          v-model="passwordForm.currentPassword"
          input-type="password"
          content="현재 비밀번호"
          placeholder="현재 비밀번호"
          auth-complete="current-password"
        />

        <MyInput
          v-model="passwordForm.newPassword"
          input-type="password"
          content="새 비밀번호"
          placeholder="새 비밀번호"
          auth-complete="new-password"
        />

        <MyInput
          v-model="passwordForm.newPasswordConfirm"
          input-type="password"
          content="새 비밀번호 확인"
          placeholder="새 비밀번호 확인"
          auth-complete="new-password"
        />

        <button class="modal-primary" type="submit" :disabled="modalLoading">
          {{ modalLoading ? "처리 중…" : "변경하기" }}
        </button>
      </form>
    </section>
  </div>

  <div
    v-if="withdrawModalOpen"
    class="modal-backdrop"
    @click.self="closeWithdrawModal"
  >
    <section class="modal-card">
      <button class="modal-close" type="button" @click="closeWithdrawModal">
        ×
      </button>

      <h2>회원 탈퇴</h2>
      <p>본인 확인을 위해 비밀번호를 입력해 주세요.</p>

      <form @submit.prevent="submitWithdraw">
        <MyInput
          v-model="withdrawPassword"
          input-type="password"
          content="비밀번호"
          placeholder="비밀번호"
          auth-complete="current-password"
        />

        <p v-if="withdrawErrorMessage" class="notice error" role="alert">
          {{ withdrawErrorMessage }}
        </p>

        <button class="modal-danger" type="submit" :disabled="modalLoading">
          {{ modalLoading ? "처리 중…" : "탈퇴하기" }}
        </button>
      </form>
    </section>
  </div>

  <div
    v-if="withdrawCompleteModalOpen"
    class="modal-backdrop"
    @click.self="moveMainAfterWithdraw"
  >
    <section class="modal-card">
      <h2>회원 탈퇴 완료</h2>
      <p>회원탈퇴가 완료되었습니다.</p>

      <button
        class="modal-primary"
        type="button"
        @click="moveMainAfterWithdraw"
      >
        확인
      </button>
    </section>
  </div>
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(24, 34, 51, 0.55);
}

.modal-card {
  position: relative;
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(19, 32, 56, 0.2);
}

.modal-card h2 {
  margin-bottom: 8px;
  color: #263247;
}

.modal-card p {
  margin-bottom: 16px;
  color: #7b8494;
  font-size: 13px;
}

.modal-card input {
  width: 100%;
  height: 42px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  outline: none;
}

.modal-card input:focus {
  border-color: #0064ff;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 15px;
  border: 0;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.modal-primary,
.modal-danger {
  width: 100%;
  height: 42px;
  margin-top: 14px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.modal-primary {
  background: #0064ff;
}

.modal-danger {
  background: #dc3548;
}

.modal-primary:disabled,
.modal-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
