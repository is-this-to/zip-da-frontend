<script setup>
import { computed, ref } from "vue";
import MyButton from "../../components/button/MyButton.vue";
import reportTypeCodes from "../../constants/reportType.js";
import myAxios from "../../api/myAxios.js";
import { useRoute } from "vue-router";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["close"]);

const route = useRoute();

const propertyId = computed(() => Number(route.params.propertyId));
const selectedReportType = ref("");
const reason = ref("");
const reportType = reportTypeCodes.reportType;

const submit = async () => {
  if (!selectedReportType.value) {
    alert("신고 유형을 선택해주세요.");
    return;
  }

  try {
    const payload = {
      propertyId: propertyId.value,
      reportType: selectedReportType.value,
      reason: reason.value,
      status: "RECEIVED",
    };
    const url = `/api/reports`;

    const response = await myAxios.post(url, payload);

    alert("신고가 접수되었습니다.");
    emit("close");
    // 초기화
    selectedReportType.value = "";
    reason.value = "";
  } catch (error) {
    const data = error.response.data;
    if (data.code === "E30") {
      alert(data.data); // 같은 회원이 같은 매물 중복 신고입니다.
    }
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay">
      <div class="modal">
        <!-- HEADER -->
        <div class="header">
          <div>
            <h2>허위매물 신고</h2>
            <p>집다는 정확한 매물 정보를 위해 상시 모니터링을 진행합니다.</p>
          </div>

          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <!-- PROPERTY INFO -->
        <div class="property-box">
          <slot name="property"></slot>
        </div>

        <!-- REPORT TYPE -->
        <div class="section">
          <label class="label">신고 사유 선택</label>

          <label
            v-for="(name, code) in reportType"
            :key="code"
            class="radio-item"
          >
            <input type="radio" v-model="selectedReportType" :value="code" />
            <span>{{ name }}</span>
          </label>
        </div>

        <!-- REASON -->
        <div class="section">
          <label class="label">상세 내용</label>

          <textarea
            v-model="reason"
            placeholder="신고 내용을 상세히 입력해주세요."
          />
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <MyButton
            color="white"
            size="small-middle"
            style="border-radius: 0.5rem; border: none; font-size: 20px"
            content="취소"
            @click="$emit('close')"
          />

          <MyButton
            color="blue"
            size="small-middle"
            style="border-radius: 0.5rem; border: none; font-size: 20px"
            content="신고하기"
            :disabled="!selectedReportType"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  width: 480px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

/* HEADER */
.header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--personal-color-periwinkle);
}

.header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--personal-color-black);
}

.header p {
  font-size: 13px;
  color: var(--personal-color-gray);
  margin-top: 4px;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

/* PROPERTY */
.property-box {
  margin: 16px 24px;
}

/* SECTION */
.section {
  padding: 0 24px;
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* RADIO */
.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 14px;
  border: 1px solid var(--personal-color-periwinkle);
  border-radius: 10px;
  margin-bottom: 10px;

  cursor: pointer;
}

.radio-item input {
  accent-color: var(--personal-color-blue);
}

/* TEXTAREA */
textarea {
  width: 100%;
  height: 120px;
  padding: 12px;

  border: 1px solid var(--personal-color-periwinkle);
  border-radius: 10px;

  resize: none;
  outline: none;
}

textarea:focus {
  border-color: var(--personal-color-blue);
}

/* FOOTER */
.footer {
  display: flex;
  gap: 12px;
  padding: 24px;
}
</style>
