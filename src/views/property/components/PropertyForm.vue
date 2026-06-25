<script setup>
import { ref, computed } from "vue";
import MyInput from "../../../components/input/MyInput.vue";
import {
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
} from "../../../constants/propertyEnums";
import { REGIONS, OPTIONS } from "../../../constants/regions";
import { uploadImage, deleteImage } from "../../../api/propertyApi";

const form = defineModel({ type: Object, required: true });

defineProps({
  errors: { type: Object, default: () => ({}) },
});

const showPrice = computed(() => form.value.transactionType === "SALE");
const showDeposit = computed(() =>
  ["JEONSE", "MONTHLY_RENT", "SHORT_TERM"].includes(form.value.transactionType),
);
const showMonthlyRent = computed(() =>
  ["MONTHLY_RENT", "SHORT_TERM"].includes(form.value.transactionType),
);

const monthlyRentDisplay = formatPrice("monthlyRent");
const maintenanceFeeDisplay = formatPrice("maintenanceFee");

const toggleOption = (optionId) => {
  const idx = form.value.optionIds.indexOf(optionId);
  form.value.optionIds =
    idx === -1
      ? [...form.value.optionIds, optionId]
      : form.value.optionIds.filter((id) => id !== optionId);
};

const MAX_IMAGES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const uploadingFiles = ref([]);
const fileInputRef = ref(null);

const triggerFileSelect = () => {
  if (form.value.imageUrls.length >= MAX_IMAGES) {
    alert(`이미지는 최대 ${MAX_IMAGES}장까지 등록 가능합니다.`);
    return;
  }
  fileInputRef.value?.click();
};

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;

  const remainSlots =
    MAX_IMAGES - form.value.imageUrls.length - uploadingFiles.value.length;
  if (files.length > remainSlots) {
    alert(
      `최대 ${MAX_IMAGES}장까지 등록 가능합니다. (남은 슬롯: ${remainSlots}장)`,
    );
    return;
  }

  for (const file of files) await uploadOne(file);
};

const uploadOne = async (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    alert(
      `${file.name}: 지원하지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)`,
    );
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    alert(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
    return;
  }

  const trackingId = Date.now() + Math.random();
  uploadingFiles.value.push({ id: trackingId, name: file.name });
  try {
    const fileUri = await uploadImage(file);
    form.value.imageUrls = [...form.value.imageUrls, fileUri];
  } catch {
    alert(`${file.name} 업로드에 실패했습니다.`);
  } finally {
    uploadingFiles.value = uploadingFiles.value.filter(
      (f) => f.id !== trackingId,
    );
  }
};

const removeImage = async (fileUri) => {
  try {
    await deleteImage(fileUri);
    form.value.imageUrls = form.value.imageUrls.filter(
      (url) => url !== fileUri,
    );
  } catch {
    alert("이미지 삭제에 실패했습니다.");
  }
};
</script>

<template>
  <div class="property-form">
    <!-- 기본 정보 -->
    <div class="section">
      <h3>기본 정보</h3>

      <MyInput
        v-model="form.description"
        :content="'매물 설명'"
        :placeholder="'매물에 대한 설명을 입력해 주세요.'"
        :required="true"
      />
      <p v-if="errors.description" class="error-text">
        {{ errors.description }}
      </p>

      <label class="field-group">
        <span class="required">매물 종류</span>
        <select v-model="form.propertyType" class="select-field">
          <option value="" disabled>선택해 주세요</option>
          <option v-for="t in PROPERTY_TYPES" :key="t.code" :value="t.code">
            {{ t.label }}
          </option>
        </select>
      </label>
      <p v-if="errors.propertyType" class="error-text">
        {{ errors.propertyType }}
      </p>

      <label class="field-group">
        <span class="required">거래 종류</span>
        <select v-model="form.transactionType" class="select-field">
          <option value="" disabled>선택해 주세요</option>
          <option v-for="t in TRANSACTION_TYPES" :key="t.code" :value="t.code">
            {{ t.label }}
          </option>
        </select>
      </label>
      <p v-if="errors.transactionType" class="error-text">
        {{ errors.transactionType }}
      </p>
    </div>

    <!-- 가격 정보 -->
    <div v-if="form.transactionType" class="section">
      <h3>가격 정보</h3>

      <MyInput
        v-if="showPrice"
        v-model.number="form.price"
        :content="'매매가 (원)'"
        :placeholder="'예: 850000000'"
        :inputType="'number'"
        :required="true"
      />
      <p v-if="errors.price" class="error-text">{{ errors.price }}</p>

      <MyInput
        v-if="showDeposit"
        v-model.number="form.deposit"
        :content="'보증금 (원)'"
        :placeholder="'예: 10000000'"
        :inputType="'number'"
        :required="true"
      />
      <p v-if="errors.deposit" class="error-text">{{ errors.deposit }}</p>

      <MyInput
        v-if="showMonthlyRent"
        v-model.number="form.monthlyRent"
        :content="'월세 / 임대료 (원)'"
        :placeholder="'예: 500000'"
        :inputType="'number'"
        :required="true"
      />
      <p v-if="errors.monthlyRent" class="error-text">
        {{ errors.monthlyRent }}
      </p>

      <MyInput
        v-model.number="form.maintenanceFee"
        :content="'관리비 (원, 선택)'"
        :placeholder="'예: 50000'"
        :inputType="'number'"
      />
    </div>

    <!-- 위치 정보 -->
    <div class="section">
      <h3>위치 정보</h3>

      <label class="field-group">
        <span class="required">지역</span>
        <select v-model="form.regionId" class="select-field">
          <option :value="null" disabled>선택해 주세요</option>
          <option v-for="r in REGIONS" :key="r.regionId" :value="r.regionId">
            {{ r.province }} {{ r.city }} {{ r.district }}
          </option>
        </select>
      </label>
      <p v-if="errors.regionId" class="error-text">{{ errors.regionId }}</p>

      <MyInput
        v-model="form.detailAddress"
        :content="'상세 주소'"
        :placeholder="'예: 마린시티 12동 101호'"
      />
    </div>

    <!-- 매물 상세 -->
    <div class="section">
      <h3>매물 상세</h3>

      <MyInput
        v-model.number="form.areaM2"
        :content="'전용면적 (㎡)'"
        :placeholder="'예: 25.5'"
        :inputType="'number'"
      />
      <p v-if="errors.areaM2" class="error-text">{{ errors.areaM2 }}</p>

      <MyInput
        v-model.number="form.roomCount"
        :content="'방 수'"
        :placeholder="'예: 1'"
        :inputType="'number'"
      />
      <p v-if="errors.roomCount" class="error-text">{{ errors.roomCount }}</p>

      <MyInput
        v-model.number="form.bathroomCount"
        :content="'욕실 수'"
        :placeholder="'예: 1'"
        :inputType="'number'"
      />
      <p v-if="errors.bathroomCount" class="error-text">
        {{ errors.bathroomCount }}
      </p>

      <MyInput
        v-model.number="form.floor"
        :content="'층'"
        :placeholder="'예: 5'"
        :inputType="'number'"
      />
      <MyInput
        v-model="form.moveInDate"
        :content="'입주가능일'"
        :inputType="'date'"
      />
    </div>

    <!-- 옵션 -->
    <div class="section">
      <h3>옵션</h3>
      <div class="options-grid">
        <label
          v-for="opt in OPTIONS"
          :key="opt.optionId"
          class="option-item"
          :class="{ checked: form.optionIds.includes(opt.optionId) }"
        >
          <input
            type="checkbox"
            :checked="form.optionIds.includes(opt.optionId)"
            @change="toggleOption(opt.optionId)"
          />
          <span>{{ opt.name }}</span>
        </label>
      </div>
    </div>

    <!-- 이미지 -->
    <div class="section">
      <h3>이미지</h3>
      <p class="hint">
        최대 {{ MAX_IMAGES }}장, jpg·png·gif·webp 형식, 한 파일당 10MB 이하. 첫
        번째 사진이 대표 이미지가 됩니다.
      </p>

      <div class="image-grid">
        <div
          v-for="(url, index) in form.imageUrls"
          :key="url"
          class="image-card"
          :class="{ thumbnail: index === 0 }"
        >
          <img :src="url" :alt="`매물 이미지 ${index + 1}`" />
          <button
            type="button"
            class="remove-btn"
            @click="removeImage(url)"
            aria-label="이미지 삭제"
          >
            ×
          </button>
          <div v-if="index === 0" class="thumbnail-badge">대표</div>
        </div>

        <div
          v-for="f in uploadingFiles"
          :key="f.id"
          class="image-card uploading"
        >
          <div class="spinner"></div>
          <small>{{ f.name }}</small>
        </div>

        <button
          v-if="form.imageUrls.length + uploadingFiles.length < MAX_IMAGES"
          type="button"
          class="add-btn"
          @click="triggerFileSelect"
        >
          <div class="plus">+</div>
          <small>이미지 추가</small>
        </button>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        @change="handleFileSelect"
        style="display: none"
      />
      <div class="counter">{{ form.imageUrls.length }} / {{ MAX_IMAGES }}</div>
      <p v-if="errors.imageUrls" class="error-text">{{ errors.imageUrls }}</p>
    </div>
  </div>
</template>

<style scoped>
.property-form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  padding: 28px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(21, 32, 48, 0.04);
}

.section h3 {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 900;
  color: #101828;
}

.error-text {
  margin: 6px 0 0;
  color: #e73431;
  font-size: 13px;
  font-weight: 600;
}

.field-group {
  display: block;
  margin-top: 20px;
}

.field-group > span {
  display: block;
  margin-bottom: 5px;
  color: #202b3d;
  font-size: 15px;
  font-weight: 800;
}

.field-group > span.required {
  color: #e73431cb;
}

.select-field {
  width: 100%;
  height: 48px;
  border: 1px solid #e3e8f2;
  border-radius: 18px;
  outline: 0;
  padding: 0 18px;
  color: #101828;
  font-size: 16px;
  background: #ffffff;
  cursor: pointer;
}

.select-field:focus {
  border-color: #0057e78c;
  box-shadow: 0 0 0 4px #0057e71a;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #e3e8f2;
  border-radius: 14px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 600;
  color: #545f6e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #0057e78c;
}

.option-item.checked {
  background: #eaf1ff;
  border-color: var(--personal-color-blue);
  color: var(--personal-color-blue);
}

.option-item input[type="checkbox"] {
  accent-color: var(--personal-color-blue);
  cursor: pointer;
}

.hint {
  margin: 0 0 12px;
  color: var(--personal-color-gray);
  font-size: 13px;
  line-height: 1.5;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}

.image-card {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 16px;
  background: #f1f3f8;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-card.thumbnail {
  box-shadow: 0 0 0 3px var(--personal-color-blue);
}

.thumbnail-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--personal-color-blue);
  color: var(--personal-color-white);
  font-size: 12px;
  font-weight: 800;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: rgba(0, 0, 0, 0.85);
}

.image-card.uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

.image-card.uploading small {
  color: var(--personal-color-gray);
  font-size: 11px;
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e3e8f2;
  border-top-color: var(--personal-color-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.add-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  aspect-ratio: 1;
  border: 2px dashed #c7d0e0;
  border-radius: 16px;
  background: transparent;
  color: var(--personal-color-gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  border-color: var(--personal-color-blue);
  background: #f4f8ff;
  color: var(--personal-color-blue);
}

.add-btn .plus {
  font-size: 36px;
  font-weight: 300;
  line-height: 1;
}

.add-btn small {
  font-size: 13px;
  font-weight: 600;
}

.counter {
  margin-top: 12px;
  text-align: right;
  color: var(--personal-color-gray);
  font-size: 13px;
  font-weight: 600;
}
</style>

