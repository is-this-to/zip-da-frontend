<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { withdrawMembership } from '../../api/mypageApi';

const router = useRouter();
const authStore = useAuthStore();
const showModal = ref(false);
const password = ref('');
const confirmText = ref('');
const processing = ref(false);
const errorMessage = ref('');
const logout = async () => {
  try {
    await authStore.logout();
  } finally {
    router.replace('/sign-in');
  }
};
const withdraw = async () => {
  if (confirmText.value !== '탈퇴합니다') {
    errorMessage.value = '확인 문구를 정확히 입력해 주세요.';
    return;
  }
  try {
    processing.value = true;
    errorMessage.value = '';
    await withdrawMembership(password.value);
    authStore.clearAuthStore();
    showModal.value = false;
    router.replace('/main');
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || '회원탈퇴를 처리하지 못했습니다.';
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <div class="page-head">
    <span>ACCOUNT</span>
    <h1>계정 관리</h1>
    <p>로그인 상태와 회원 계정을 안전하게 관리하세요.</p>
  </div>
  <section class="account-card">
    <div class="icon blue">↗</div>
    <div>
      <h2>로그아웃</h2>
      <p>현재 기기에서 ZIPDA 계정 로그인을 종료합니다.</p>
    </div>
    <button class="outline" @click="logout">로그아웃</button>
  </section>
  <section class="account-card danger-card">
    <div class="icon red">!</div>
    <div>
      <h2>회원탈퇴</h2>
      <p>
        탈퇴하면 프로필과 찜 목록을 더 이상 이용할 수 없습니다. 작성한 게시물의
        처리 정책은 팀의 서버 정책을 따릅니다.
      </p>
    </div>
    <button class="danger" @click="showModal = true">회원탈퇴</button>
  </section>
  <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
    <form class="modal" @submit.prevent="withdraw">
      <button
        type="button"
        class="close"
        aria-label="닫기"
        @click="showModal = false"
      >
        ×
      </button>
      <div class="warning">!</div>
      <h2>정말 탈퇴하시겠어요?</h2>
      <p>
        이 작업은 되돌릴 수 없습니다. 계속하려면 아래에 <b>탈퇴합니다</b>를
        입력해 주세요.
      </p>
      <label
        ><span>현재 비밀번호</span
        ><input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="서버 정책상 필요한 경우 입력" /></label
      ><label
        ><span>확인 문구</span
        ><input v-model="confirmText" placeholder="탈퇴합니다"
      /></label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="modal-actions">
        <button type="button" @click="showModal = false">취소</button
        ><button
          class="danger"
          :disabled="processing || confirmText !== '탈퇴합니다'"
        >
          {{ processing ? '처리 중…' : '탈퇴하기' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 24px;
}
.page-head > span {
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
.account-card {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border: 1px solid #e7eaf1;
  border-radius: 12px;
  background: #fff;
}
.account-card + .account-card {
  margin-top: 14px;
}
.account-card .icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 900;
}
.blue {
  color: #0064ff;
  background: #eaf2ff;
}
.red {
  color: #d6283d;
  background: #ffedef;
}
.account-card h2 {
  margin-bottom: 5px;
  font-size: 16px;
}
.account-card p {
  max-width: 600px;
  color: #7c8595;
  font-size: 12px;
  line-height: 1.6;
}
.account-card button {
  padding: 9px 13px;
  border-radius: 7px;
  background: #fff;
  font-weight: 800;
  cursor: pointer;
}
.outline {
  border: 1px solid #dce2eb;
  color: #596375;
}
.danger-card {
  border-color: #f4d7da;
}
.danger {
  border: 1px solid #e24b5d;
  color: #fff;
  background: #dc3548 !important;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(24, 34, 51, 0.55);
  backdrop-filter: blur(3px);
}
.modal {
  position: relative;
  width: min(100%, 460px);
  padding: 30px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}
.close {
  position: absolute;
  top: 15px;
  right: 17px;
  border: 0;
  color: #7e8796;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}
.warning {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 50%;
  color: #d62f43;
  background: #ffedef;
  font-size: 22px;
  font-weight: 900;
}
.modal h2 {
  margin-bottom: 9px;
  font-size: 21px;
}
.modal > p {
  margin-bottom: 20px;
  color: #757f90;
  font-size: 13px;
  line-height: 1.6;
}
.modal label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 14px;
}
.modal label span {
  color: #5d6676;
  font-size: 11px;
  font-weight: 800;
}
.modal input {
  height: 43px;
  padding: 0 12px;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
  outline: 0;
}
.modal input:focus {
  border-color: #0064ff;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}
.error-message {
  margin: 12px 0 0 !important;
  color: #c22c3e !important;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}
.modal-actions button {
  padding: 10px 16px;
  border: 0;
  border-radius: 7px;
  color: #657082;
  background: #eef0f4;
  font-weight: 800;
  cursor: pointer;
}
.modal-actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
@media (max-width: 580px) {
  .account-card {
    grid-template-columns: 44px 1fr;
  }
  .account-card > button {
    grid-column: 1 / -1;
  }
  .modal {
    padding: 24px;
  }
}
</style>
