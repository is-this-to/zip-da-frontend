<script setup>
import { ref } from "vue";

const passwordModalOpen = ref(false);
const withdrawModalOpen = ref(false);
</script>

<template>
  <div class="page-head">
    <span>ACCOUNT</span>
    <h1>계정 관리</h1>
    <p>지금은 버튼 모양만 만든 상태입니다. 실제 기능은 나중에 연결합니다.</p>
  </div>

  <section class="account-card">
    <div class="icon blue">↪</div>
    <div>
      <h2>로그아웃</h2>
      <p>로그아웃은 담당자 기능이라서 여기서는 호출하지 않습니다.</p>
    </div>
    <button class="outline" disabled>로그아웃</button>
  </section>

  <section class="account-card">
    <div class="icon blue">🔒</div>
    <div>
      <h2>비밀번호 변경</h2>
      <p>비밀번호 변경 화면만 확인할 수 있습니다.</p>
    </div>
    <button class="outline" @click="passwordModalOpen = true">변경</button>
  </section>

  <section class="account-card danger-card">
    <div class="icon red">!</div>
    <div>
      <h2>회원탈퇴</h2>
      <p>회원탈퇴 화면만 확인할 수 있습니다. 실제 API는 아직 호출하지 않습니다.</p>
    </div>
    <button class="danger" @click="withdrawModalOpen = true">회원탈퇴</button>
  </section>

  <div v-if="passwordModalOpen" class="modal-backdrop" @click.self="passwordModalOpen = false">
    <section class="modal">
      <button class="close" type="button" @click="passwordModalOpen = false">×</button>
      <h2>비밀번호 변경</h2>
      <p>API 연결 전 화면입니다.</p>
      <input type="password" placeholder="현재 비밀번호" disabled />
      <input type="password" placeholder="새 비밀번호" disabled />
      <input type="password" placeholder="새 비밀번호 확인" disabled />
      <button class="outline full" disabled>변경하기</button>
    </section>
  </div>

  <div v-if="withdrawModalOpen" class="modal-backdrop" @click.self="withdrawModalOpen = false">
    <section class="modal">
      <button class="close" type="button" @click="withdrawModalOpen = false">×</button>
      <h2>회원탈퇴</h2>
      <p>API 연결 전 화면입니다.</p>
      <input placeholder="탈퇴합니다" disabled />
      <button class="danger full" disabled>탈퇴하기</button>
    </section>
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
.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 18px;
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
  color: #7c8595;
  font-size: 12px;
}
.account-card button,
.full {
  padding: 9px 13px;
  border-radius: 7px;
  font-weight: 800;
  cursor: pointer;
}
.outline {
  border: 1px solid #dce2eb;
  color: #596375;
  background: #fff;
}
.outline:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.danger-card {
  border-color: #f4d7da;
}
.danger {
  border: 1px solid #e24b5d;
  color: #fff;
  background: #dc3548;
}
.danger:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(24, 34, 51, 0.55);
}
.modal {
  position: relative;
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 15px;
  background: #fff;
}
.close {
  position: absolute;
  top: 12px;
  right: 15px;
  border: 0;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}
.modal input {
  width: 100%;
  height: 42px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #dfe4ec;
  border-radius: 8px;
}
.full {
  width: 100%;
  margin-top: 12px;
}
</style>
