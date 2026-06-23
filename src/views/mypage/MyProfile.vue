<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { getMyProfile, updateMyProfile } from '../../api/mypageApi';

const authStore = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const errorMessage = ref('');
const photoUrl = ref('');
const form = reactive({
  name: '',
  nick: '',
  email: '',
  phone: '',
  introduction: '',
});
let initialForm = '';

const fillForm = (data = {}) => {
  Object.assign(form, {
    name: data.name ?? '',
    nick: data.nick ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    introduction: data.introduction ?? '',
  });
  photoUrl.value = data.profileImageUrl ?? '';
  initialForm = JSON.stringify(form);
};

const loadProfile = async () => {
  try {
    const result = await getMyProfile();
    fillForm(result.data);
  } catch {
    fillForm(authStore.userInfo || {});
    errorMessage.value =
      '프로필 API 연결 전입니다. 로그인 정보로 표시하고 있어요.';
  } finally {
    loading.value = false;
  }
};

const choosePhoto = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '프로필 이미지는 5MB 이하만 등록할 수 있습니다.';
    return;
  }
  photoUrl.value = URL.createObjectURL(file);
  message.value = '사진 미리보기가 적용되었습니다.';
};

const resetForm = () => {
  Object.assign(form, JSON.parse(initialForm));
  message.value = '변경 내용을 되돌렸습니다.';
};

const saveProfile = async () => {
  errorMessage.value = '';
  message.value = '';
  if (!form.name.trim() || !form.nick.trim()) {
    errorMessage.value = '이름과 닉네임을 입력해 주세요.';
    return;
  }
  try {
    saving.value = true;
    const result = await updateMyProfile(form);
    fillForm(result.data ?? form);
    if (authStore.userInfo)
      Object.assign(authStore.userInfo, result.data ?? form);
    message.value = '프로필이 저장되었습니다.';
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      '저장하지 못했습니다. 서버 연결을 확인해 주세요.';
  } finally {
    saving.value = false;
  }
};

onMounted(loadProfile);
</script>

<template>
  <div class="page-head">
    <span>MY PROFILE</span>
    <h1>프로필 수정</h1>
    <p>ZIPDA에서 사용할 내 정보를 확인하고 관리하세요.</p>
  </div>
  <div v-if="loading" class="state-card">프로필을 불러오는 중입니다…</div>
  <form v-else class="profile-form" @submit.prevent="saveProfile">
    <section class="photo-card">
      <div
        class="photo"
        :style="photoUrl ? { backgroundImage: `url(${photoUrl})` } : {}"
      >
        <span v-if="!photoUrl">{{
          form.nick?.slice(0, 1) || form.name?.slice(0, 1) || 'Z'
        }}</span>
      </div>
      <div>
        <h2>프로필 사진</h2>
        <p>JPG, PNG 또는 WEBP · 최대 5MB</p>
        <div class="photo-actions">
          <label
            ><input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="choosePhoto"
            />사진 변경</label
          ><button type="button" @click="photoUrl = ''">삭제</button>
        </div>
      </div>
    </section>
    <section class="form-card">
      <div class="form-grid">
        <label
          ><span>이름</span
          ><input v-model="form.name" autocomplete="name" placeholder="이름"
        /></label>
        <label
          ><span>닉네임</span><input v-model="form.nick" placeholder="닉네임"
        /></label>
        <label
          ><span>이메일</span
          ><input
            v-model="form.email"
            type="email"
            autocomplete="email"
            disabled
          /><small>이메일은 변경할 수 없습니다.</small></label
        >
        <label
          ><span>휴대폰 번호</span
          ><input
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="010-1234-5678"
        /></label>
        <label class="wide"
          ><span>자기소개</span
          ><textarea
            v-model="form.introduction"
            maxlength="200"
            placeholder="간단한 자기소개를 작성해 주세요."
          ></textarea
          ><small>{{ form.introduction.length }}/200</small></label
        >
      </div>
    </section>
    <p v-if="message" class="notice success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="notice error" role="alert">
      {{ errorMessage }}
    </p>
    <div class="form-actions">
      <button type="button" class="secondary" @click="resetForm">취소</button
      ><button class="primary" :disabled="saving">
        {{ saving ? '저장 중…' : '저장하기' }}
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
  border-radius: 12px;
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
.photo-card p {
  color: #8b94a4;
  font-size: 12px;
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
.form-grid input,
.form-grid textarea {
  width: 100%;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  outline: none;
  color: #263247;
  background: #f8f9fd;
  font: inherit;
  transition: 0.2s;
}
.form-grid input {
  height: 45px;
  padding: 0 13px;
}
.form-grid textarea {
  min-height: 100px;
  padding: 12px 13px;
  resize: vertical;
}
.form-grid input:focus,
.form-grid textarea:focus {
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
.wide {
  grid-column: 1 / -1;
}
.wide small {
  align-self: flex-end;
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
  .wide {
    grid-column: auto;
  }
  .photo-card {
    align-items: flex-start;
  }
  .form-actions button {
    flex: 1;
  }
}
</style>
