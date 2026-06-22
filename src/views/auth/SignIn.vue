<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import signInValidator from "../../util/validator/domain/auth/signInValidator.js";
import MyButton from "../../components/button/MyButton.vue";
import MyInput from "../../components/input/MyInput.vue";

const router = useRouter();
const authStore = useAuthStore();

const notYet = () => alert("2차 구현 예정입니다.");

const signInForm = reactive({
  email: "",
  password: "",
});
// 보기 눌러서 비밀번호 보이게 해주는 변수
const showPassword = ref(false);
// login 요청 처리 중 중복 submitLogin 함수 실행 저지
const isSubmitting = ref(false);
const errorMessage = ref("");

const submitLogin = async () => {
  if (isSubmitting.value) return;
  // 유효성 검사
  const emailValResult = signInValidator.email(signInForm.email);
  const passwordValResult = signInValidator.password(signInForm.password);
  // 유효성 성공하면 if절
  if(!emailValResult && !passwordValResult) {
    try {
      isSubmitting.value = true;
      errorMessage.value = "";
      await authStore.login(signInForm);
      router.push("/main");
    } catch (error) {
      errorMessage.value = "이메일 또는 비밀번호를 확인해 주세요.";
    } finally {
      isSubmitting.value = false;
    }
  }
  else {
    errorMessage.value = `${emailValResult}\n${passwordValResult}`;
  }
};

</script>

<template>
  <main class="login-page">
    <section class="login-shell">
      <div class="brand-panel">
        <RouterLink to="/main" class="brand-mark" aria-label="집다 메인으로 이동">
          <strong>ZIPDA</strong>
        </RouterLink>

        <div class="brand-copy">
          <p class="eyebrow">Welcome back</p>
          <h1>좋은 집을 찾는 여정을<br />다시 이어가세요.</h1>
          <p>
            저장한 검색 조건, 관심 매물까지 로그인 후 한 번에 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <form class="login-card" @submit.prevent="submitLogin">
        <div class="form-heading">
          <p>Sign in</p>
          <h2>로그인</h2>
          <span>집다 계정으로 안전하게 접속하세요.</span>
        </div>
        <MyInput
          :content="'이메일'"
          :input-type="'email'"
          :auth-complete="'email'"
          :placeholder="'example@zipda.com'"
          :required="true"
          v-model="signInForm.email"
        ></MyInput>

        <MyInput
            v-model="signInForm.password"
            v-model:is-show-password="showPassword"
            :content="'비밀번호'"
            :auth-complete="'current-password'"
            :placeholder="'비밀번호 입력해주세요'"
            :required="true"
            :is-pass-word="true"
        ></MyInput>

        <div class="form-row">
          <label class="remember-me">
            <input type="checkbox" />
            <span>로그인 유지</span>
          </label>
          <a href="#" @click="notYet">비밀번호 찾기</a>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <MyButton
          :content='isSubmitting ? "로그인 중..." : "로그인" '
          :color="'blue'"
          :size="'middle'"
          :class="'submit-button'"
          :btn-type="'submit'"
        ></MyButton>

        <div class="divider">
          <span></span>
          <p>간편 로그인</p>
          <span></span>
        </div>

        <div class="social-grid">
          <button type="button" class="kakao-button" @click="notYet">Kakao</button>
          <button type="button" class="naver-button" @click="notYet">Naver</button>
        </div>

        <p class="signup-copy">
          아직 계정이 없나요?
          <RouterLink to="/sign-up">회원가입</RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px 24px;
  color: #121826;
  background:
    radial-gradient(circle at 22% 18%, #0064ff2e, transparent 30%),
    radial-gradient(circle at 76% 82%, #ff624d33, transparent 28%),
    linear-gradient(135deg, #eef3ff 0%, #f8fbff 46%, #eef2f8 100%);
}

.login-shell {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 500px);
  width: min(1060px, 100%);
  min-height: 680px;
  border: 1px solid var(--personal-color-white);
  border-radius: 36px;
  overflow: hidden;
  background: var(--personal-color-white);
  box-shadow: 0 34px 90px #1b2d4e2e;
  backdrop-filter: blur(18px);
}

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 42px;
  overflow: hidden;
  color: #ffffff;
  background:
    linear-gradient(160deg, #041534e6, #0057e7d1),
    linear-gradient(135deg, #0f172a, #0057e7);
}

.brand-panel::before,
.brand-panel::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  background: #ffffff1f;
}

.brand-panel::before {
  width: 280px;
  height: 280px;
  right: -92px;
  top: 72px;
}

.brand-panel::after {
  width: 220px;
  height: 220px;
  left: -80px;
  bottom: -76px;
}

.brand-mark,
.brand-copy {
  position: relative;
  z-index: 1;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  color: #ffffff;
  text-decoration: none;
}

.brand-mark strong {
  font-size: 24px;
  font-weight: 900;
}

.eyebrow {
  width: fit-content;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  color: #dbeafe;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
  font-weight: 900;
}

.brand-copy h1 {
  margin-top: 22px;
  font-size: 42px;
  line-height: 1.24;
  font-weight: 900;
}

.brand-copy p:not(.eyebrow) {
  max-width: 410px;
  margin-top: 18px;
  color: #dbe5ff;
  font-size: 16px;
  line-height: 1.75;
}

.trust-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 54px 58px;
  background: var(--personal-color-white);
  width: 100%;
}

.form-heading p {
  color: #0058e6;
  font-size: 13px;
  font-weight: 900;
}

.form-heading h2 {
  margin-top: 8px;
  color: #101828;
  font-size: 40px;
  line-height: 1.2;
}

.form-heading span {
  display: block;
  margin-top: 10px;
  color: #667085;
  font-size: 15px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: 18px;
  color: #667085;
  font-size: 14px;
  font-weight: 700;
}

.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: #0057e7;
}

.form-row a,
.signup-copy a {
  color: #0057e7;
  text-decoration: none;
  font-weight: 900;
}

.error-message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #b42318;
  background: #fff1f0;
  font-size: 14px;
  font-weight: 800;
  white-space: pre-line;
  text-align: center;
}

.submit-button {
  height: 58px;
  border: 0;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 16px 32px #0057e747;
  margin-top: 24px;
  width: 100%;
}

.submit-button:disabled {
  cursor: progress;
  opacity: 0.72;
}

.divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
  margin: 28px 0 20px;
  color: #8a94a6;
  font-size: 13px;
  font-weight: 800;
}

.divider span {
  height: 1px;
  background: #d8deea;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.social-grid button {
  height: 54px;
  border: 0;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.kakao-button {
  color: #231f20;
  background: #fee500;
}

.naver-button {
  color: #ffffff;
  background: #03c75a;
}

.signup-copy {
  margin-top: 28px;
  color: #667085;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    min-height: 360px;
  }
}

@media (max-width: 560px) {
  .login-page {
    padding: 18px;
  }

  .login-shell {
    border-radius: 26px;
  }

  .brand-panel,
  .login-card {
    padding: 30px 24px;
  }

  .brand-copy h1,
  .form-heading h2 {
    font-size: 32px;
  }

  .social-grid {
    grid-template-columns: 1fr;
  }
}
</style>
