<script setup>
import { onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import MyInput from "../../components/input/MyInput.vue";
import MyButton from "../../components/button/MyButton.vue";
import agentApplyValidator from "../../util/validator/domain/auth/agentApplyValidator.js";
import { useFileStore } from "../../store/file/useFileStore.js";
import { useAgentStore } from "../../store/agent/useAgentStore.js";
import { useMyErrorStore } from "../../store/error/useMyErrorStore.js";

const router = useRouter();
const fileStore = useFileStore();
const agentStore = useAgentStore();
const myErrorStore = useMyErrorStore();

const applyForm = reactive({
  licenseNo: "",
  businessNo: "",
  officeName: "",
  agentImageUrl: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");
// 미리 보기 용 임시 URL 저장
const preview = ref(null);

const submitApply = async () => {
  if (isSubmitting.value) return;

  const licenseNoValResult = agentApplyValidator.licenseNo(applyForm.licenseNo);
  const bussinessNoValResult = agentApplyValidator.businessNo(
    applyForm.businessNo,
  );
  const officeNameValResult = agentApplyValidator.officeName(
    applyForm.officeName,
  );

  if (!licenseNoValResult && !bussinessNoValResult && !officeNameValResult) {
    try {
      isSubmitting.value = true;
      errorMessage.value = "";

      const newApplyForm = {
        licenseNo: applyForm.licenseNo.replace(/\D/g, ""),
        businessNo: applyForm.businessNo.replace(/\D/g, ""),
        officeName: applyForm.officeName.trim(),
      };

      await agentStore.applyAgent(newApplyForm);
      await router.replace("/");
    } catch (error) {
      myErrorStore.errorMessage.value =
        error.response?.data?.data ?? "신청 처리 중 오류가 발생했습니다.";
    } finally {
      isSubmitting.value = false;
    }
  } else {
    const validationMessages = [
      licenseNoValResult,
      bussinessNoValResult,
      officeNameValResult,
    ].filter(Boolean);
    errorMessage.value = validationMessages.join("\n");
  }
};

const handleChangeProfile = async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (preview.value) {
      // 이전에 미리보기 URL을 만든적이 있다면 기존 URL을 브라우저 메모리에서 해제
      // if 안한다면 사용자가 파일을 계속 변경하면 기존 URL이 메모리에 남아 메모리 누수가 발생할 수 있음
      URL.revokeObjectURL(preview.value);
    }
    // API 서버에 파일 저장 요청
    const fileUri = await fileStore.storeAgentProfile(file);

    if (fileUri) {
      applyForm.agentImageUrl = fileUri;
      preview.value = URL.createObjectURL(file);
    }
  }
};

onBeforeUnmount(() => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value);
  }
});
</script>

<template>
  <main class="agent-apply-page">
    <section class="apply-shell">
      <div class="apply-header">
        <p class="eyebrow">Agent Verification</p>
        <h1>공인중개사 인증 신청</h1>
        <p>
          관리자 검수 후 승인되면 중개사 권한으로 매물을 등록하고 관리할 수
          있습니다.
        </p>
      </div>

      <form class="apply-card" @submit.prevent="submitApply">
        <MyInput
          v-model="applyForm.licenseNo"
          :content="'공인중개사 자격번호'"
          :required="true"
        />

        <MyInput
          v-model="applyForm.businessNo"
          :content="'사업자등록번호'"
          :required="true"
        />

        <MyInput
          v-model="applyForm.officeName"
          :content="'중개사무소명'"
          :required="true"
        />

        <div class="notice-box">
          <strong>확인해 주세요</strong>
          <p>
            제출한 정보는 관리자 검수에만 사용됩니다. 승인 전까지는 신청 상태가
            대기로 표시됩니다.
          </p>
        </div>

        <p v-if="errorMessage" class="message error-message">
          {{ errorMessage }}
        </p>

        <div class="agentProfileImageBox">
          <div class="profile-label">중개사 프로필 이미지</div>
          <div
            class="preview"
            v-if="preview"
            :style="{ backgroundImage: `url(${preview})` }"
          ></div>
          <input type="file" accept="image/*" @change="handleChangeProfile" />
        </div>

        <div class="button-row">
          <MyButton
            :content="'취소'"
            :color="'white'"
            :size="'middle'"
            :btn-type="'button'"
            :class="'blue-pill'"
            @click="router.back()"
          />

          <MyButton
            :content="isSubmitting ? '신청 중...' : '인증 신청'"
            :color="'blue'"
            :size="'middle'"
            :class="'blue-pill'"
            :btn-type="'submit'"
          />
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.agent-apply-page {
  min-height: 100vh;
  padding: 72px 20px 96px;
  background:
    linear-gradient(180deg, #f8f9fd 0%, #ffffff 48%),
    var(--personal-color-white);
}

.apply-shell {
  max-width: 760px;
  margin: 0 auto;
}

.apply-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--personal-color-blue);
  font-size: 14px;
  font-weight: 800;
}

.apply-header h1 {
  margin: 0;
  color: var(--personal-color-black);
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0;
}

.apply-header p {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.7;
}

.apply-card {
  padding: 32px;
  border: 1px solid var(--personal-color-periwinkle);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(31, 31, 31, 0.08);
}

.notice-box {
  margin-top: 24px;
  padding: 18px;
  border-radius: 18px;
  background: #f3f6ff;
  border: 1px solid var(--personal-color-periwinkle);
}

.notice-box strong {
  display: block;
  color: var(--personal-color-black);
  font-size: 15px;
  font-weight: 900;
}

.notice-box p {
  margin: 8px 0 0;
  color: var(--personal-color-gray);
  font-size: 14px;
  line-height: 1.6;
}

.message {
  margin: 18px 0 0;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.5;
}

.error-message {
  color: #e73431;
}

.success-message {
  color: var(--personal-color-blue);
}

.agentProfileImageBox {
  margin-top: 20px;
  border: 1px dashed var(--personal-color-periwinkle);
  border-radius: 20px;
  background: var(--personal-color-white);
}

.agentProfileImageBox .preview {
  width: 100%;
  height: 220px;
  margin-bottom: 14px;
  border-radius: 16px;
  border: 1px solid var(--personal-color-periwinkle);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #ffffff;
  box-shadow: 0 10px 24px rgba(31, 31, 31, 0.08);
}

.agentProfileImageBox input[type="file"] {
  width: 100%;
  min-height: 48px;
  padding: 12px;
  border: 1px solid var(--personal-color-periwinkle);
  border-radius: 14px;
  background: #ffffff;
  color: var(--personal-color-gray);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.agentProfileImageBox input[type="file"]::file-selector-button {
  margin-right: 14px;
  padding: 10px 16px;
  border: 0;
  border-radius: 12px;
  background: var(--personal-color-blue);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  font-weight: 400;
}

.agentProfileImageBox input[type="file"]::file-selector-button:hover {
  filter: brightness(0.9);
}

button:hover {
  filter: brightness(0.9);
}

.agentProfileImageBox input[type="file"]:focus {
  outline: none;
  border-color: var(--personal-color-blue);
  box-shadow: 0 0 0 4px rgba(0, 100, 255, 0.12);
}

.profile-label {
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.button-row {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.blue-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 0 38px;
  border: 0;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 850;
  cursor: pointer;
}

@media (max-width: 640px) {
  .agentProfileImageBox {
    padding: 14px;
    border-radius: 18px;
  }

  .agentProfileImageBox .preview {
    height: 180px;
  }

  .agent-apply-page {
    padding: 48px 16px 72px;
  }

  .apply-header h1 {
    font-size: 28px;
  }

  .apply-card {
    padding: 24px 18px;
    border-radius: 20px;
  }

  .button-row {
    flex-direction: column-reverse;
  }
}
</style>
