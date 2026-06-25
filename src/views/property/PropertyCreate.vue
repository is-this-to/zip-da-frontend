<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MyButton from "../../components/button/MyButton.vue";
import PropertyForm from "./components/PropertyForm.vue";
import { usePropertyCreateStore } from "../../store/property/usePropertyCreateStore";
import validatePropertyForm from "../../util/validator/domain/property/propertyValidator";

const router = useRouter();
const store = usePropertyCreateStore();

const form = ref({
  description: "",
  propertyType: "",
  transactionType: "",
  price: null,
  deposit: null,
  monthlyRent: null,
  maintenanceFee: null,
  regionId: null,
  detailAddress: "",
  areaM2: null,
  roomCount: null,
  bathroomCount: null,
  floor: null,
  moveInDate: "",
  optionIds: [],
  imageUrls: [],
});

const errors = ref({});

const handleSubmit = async () => {
  const validationErrors = validatePropertyForm(form.value);
  errors.value = validationErrors;

  if (Object.keys(validationErrors).length > 0) {
    alert("입력 정보를 확인해 주세요.");
    return;
  }

  try {
    const result = await store.submitCreate(form.value);
    alert("매물이 등록되었습니다.");
    router.push(`/properties/${result.propertyId}`);
  } catch (error) {
    const message = error.response?.data?.message || "매물 등록에 실패했습니다.";
    alert(message);
  }
};

const handleCancel = () => {
  if (confirm("작성 중인 내용이 사라집니다. 취소하시겠습니까?")) {
    router.push("/");
  }
};
</script>

<template>
  <main class="page">
    <header class="page-header">
      <h1>매물 등록</h1>
      <p>새로운 매물을 등록해 보세요.</p>
    </header>

    <PropertyForm v-model="form" :errors="errors" />

    <div class="actions">
      <MyButton
        :content="'취소'"
        :color="'white'"
        :size="'small-middle'"
        :class="'btn-cancel'"
        @click="handleCancel"
      />
      <MyButton
        :content="store.isSubmitting ? '등록 중...' : '매물 등록'"
        :color="'blue'"
        :size="'small-middle'"
        :class="'btn-submit'"
        @click="handleSubmit"
        :disabled="store.isSubmitting"
      />
    </div>
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  color: var(--personal-color-black);
}

.page-header {
  margin-bottom: 32px;
  padding: 0 4px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 900;
  line-height: 1.1;
}

.page-header p {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 16px;
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 36px;
}

.btn-cancel,
.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 32px;
  border: 0;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.btn-cancel {
  border: 1px solid #e3e8f2;
  color: var(--personal-color-gray);
}

.btn-cancel:hover {
  background: #f4f8ff;
}

.btn-submit:hover {
  transform: scale(1.02);
  transition: 0.2s;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .page {
    padding: 24px 12px 60px;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
