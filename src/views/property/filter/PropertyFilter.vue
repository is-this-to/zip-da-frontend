<script setup>
import { ref } from "vue";
import { usePropertySearchStore } from "../../../store/property/usePropertySearchStore";
import transactionTypeCode from "../../../constants/transactionTypeCode";
import propertyType from "../../../constants/propertyType";

const store = usePropertySearchStore();

// 🟢 화면 입력용 임시 가격 (만원 단위)
// 사용자가 5000을 입력하면 나중에 10000을 곱해서 스토어에 넘깁니다.
const localPrices = ref({
  minPrice: null,
  maxPrice: null,
  minDeposit: null,
  maxDeposit: null,
  minMonthlyRent: null,
  maxMonthlyRent: null,
});

const isAdvancedOpen = ref(false);

const toggleAdvancedFilter = () => {
  isAdvancedOpen.value = !isAdvancedOpen.value;
  // 상세 창을 열 때, 기존 스토어에 값이 있다면 만원 단위로 나눠서 화면에 표시
  if (isAdvancedOpen.value) {
    localPrices.value.minPrice = store.searchFilters.minPrice
      ? store.searchFilters.minPrice / 10000
      : null;
    localPrices.value.maxPrice = store.searchFilters.maxPrice
      ? store.searchFilters.maxPrice / 10000
      : null;
    localPrices.value.minDeposit = store.searchFilters.minDeposit
      ? store.searchFilters.minDeposit / 10000
      : null;
    localPrices.value.maxDeposit = store.searchFilters.maxDeposit
      ? store.searchFilters.maxDeposit / 10000
      : null;
    localPrices.value.minMonthlyRent = store.searchFilters.minMonthlyRent
      ? store.searchFilters.minMonthlyRent / 10000
      : null;
    localPrices.value.maxMonthlyRent = store.searchFilters.maxMonthlyRent
      ? store.searchFilters.maxMonthlyRent / 10000
      : null;
  }
};

// 일반 검색 (드롭다운 변경 시)
const handleSearch = () => {
  store.searchPropertyPagination(1);
};

// 🟢 거래 유형(매매, 전세, 월세)이 바뀔 때 가격 필터 자동 리셋 로직
const handleTransactionChange = () => {
  // 1. 스토어 가격 리셋
  store.searchFilters.minPrice = null;
  store.searchFilters.maxPrice = null;
  store.searchFilters.minDeposit = null;
  store.searchFilters.maxDeposit = null;
  store.searchFilters.minMonthlyRent = null;
  store.searchFilters.maxMonthlyRent = null;

  // 2. 화면 입력용 가격 리셋
  localPrices.value = {
    minPrice: null,
    maxPrice: null,
    minDeposit: null,
    maxDeposit: null,
    minMonthlyRent: null,
    maxMonthlyRent: null,
  };

  // 3. 다시 검색
  handleSearch();
};

// 🟢 가격 적용하기 버튼 (10000 곱해서 백엔드로 전송)
const applyPrices = () => {
  store.searchFilters.minPrice = localPrices.value.minPrice
    ? localPrices.value.minPrice * 10000
    : null;
  store.searchFilters.maxPrice = localPrices.value.maxPrice
    ? localPrices.value.maxPrice * 10000
    : null;
  store.searchFilters.minDeposit = localPrices.value.minDeposit
    ? localPrices.value.minDeposit * 10000
    : null;
  store.searchFilters.maxDeposit = localPrices.value.maxDeposit
    ? localPrices.value.maxDeposit * 10000
    : null;
  store.searchFilters.minMonthlyRent = localPrices.value.minMonthlyRent
    ? localPrices.value.minMonthlyRent * 10000
    : null;
  store.searchFilters.maxMonthlyRent = localPrices.value.maxMonthlyRent
    ? localPrices.value.maxMonthlyRent * 10000
    : null;

  handleSearch();
};

// 전체 초기화
const resetFilter = () => {
  store.resetFilters();
  localPrices.value = {
    minPrice: null,
    maxPrice: null,
    minDeposit: null,
    maxDeposit: null,
    minMonthlyRent: null,
    maxMonthlyRent: null,
  };
  isAdvancedOpen.value = false;
};
</script>

<template>
  <div class="filter-wrapper">
    <div class="top-row">
      <div class="region-select-box">
        <svg
          class="location-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <select
          class="custom-select region-select"
          v-model="store.searchFilters.regionId"
          @change="handleSearch"
        >
          <option :value="null">지역 (전체보기)</option>
          <option value="1">서울특별시 강남구 역삼동</option>
          <option value="2">서울특별시 강남구 삼성동</option>
          <option value="3">경기도 성남시 분당구</option>
        </select>
      </div>

      <select
        class="custom-select"
        v-model="store.searchFilters.propertyType"
        @change="handleSearch"
      >
        <option :value="null">유형 (전체)</option>
        <option
          v-for="(name, code) in propertyType.propertyType"
          :key="code"
          :value="code"
        >
          {{ name }}
        </option>
      </select>

      <select
        class="custom-select"
        v-model="store.searchFilters.transactionType"
        @change="handleTransactionChange"
      >
        <option :value="null">거래 (전체)</option>
        <option
          v-for="(name, code) in transactionTypeCode.transactionType"
          :key="code"
          :value="code"
        >
          {{ name }}
        </option>
      </select>

      <select
        class="custom-select"
        v-model="store.searchFilters.status"
        @change="handleSearch"
      >
        <option :value="null">상태 (전체)</option>
        <option value="FOR_SALE">판매중</option>
        <option value="COMPLETED">거래완료</option>
      </select>

      <button
        class="advanced-filter-btn"
        @click="toggleAdvancedFilter"
        :class="{ active: isAdvancedOpen }"
        title="가격 상세 필터"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
      </button>

      <button class="reset-btn" @click="resetFilter" title="모든 조건 초기화">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
      </button>
    </div>

    <div class="advanced-panel" v-if="isAdvancedOpen">
      <div
        class="price-group"
        v-if="
          store.searchFilters.transactionType !== 'MONTHLY_RENT' &&
          store.searchFilters.transactionType !== 'JEONSE'
        "
      >
        <label>매매가 (만원)</label>
        <div class="input-range">
          <input
            type="number"
            v-model="localPrices.minPrice"
            placeholder="최소"
            @keyup.enter="applyPrices"
          />
          <span>~</span>
          <input
            type="number"
            v-model="localPrices.maxPrice"
            placeholder="최대"
            @keyup.enter="applyPrices"
          />
        </div>
      </div>

      <div
        class="price-group"
        v-if="store.searchFilters.transactionType !== 'SALE'"
      >
        <label>보증금/전세가 (만원)</label>
        <div class="input-range">
          <input
            type="number"
            v-model="localPrices.minDeposit"
            placeholder="최소"
            @keyup.enter="applyPrices"
          />
          <span>~</span>
          <input
            type="number"
            v-model="localPrices.maxDeposit"
            placeholder="최대"
            @keyup.enter="applyPrices"
          />
        </div>
      </div>

      <div
        class="price-group"
        v-if="
          store.searchFilters.transactionType === 'MONTHLY_RENT' ||
          !store.searchFilters.transactionType
        "
      >
        <label>월세 (만원)</label>
        <div class="input-range">
          <input
            type="number"
            v-model="localPrices.minMonthlyRent"
            placeholder="최소"
            @keyup.enter="applyPrices"
          />
          <span>~</span>
          <input
            type="number"
            v-model="localPrices.maxMonthlyRent"
            placeholder="최대"
            @keyup.enter="applyPrices"
          />
        </div>
      </div>

      <button class="apply-btn" @click="applyPrices">적용하기</button>
    </div>
  </div>
</template>

<style scoped>
.filter-wrapper {
  background-color: #f2f4f8;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.top-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 새로운 지역 드롭다운 스타일 */
.region-select-box {
  flex-grow: 1;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding-left: 16px;
  height: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.location-icon {
  width: 20px;
  height: 20px;
  color: #888;
}

.region-select {
  flex-grow: 1;
  box-shadow: none !important;
  background-color: transparent !important;
}

.custom-select {
  appearance: none;
  background-color: #ffffff;
  border: none;
  border-radius: 8px;
  height: 48px;
  padding: 0 36px 0 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  outline: none;
}

.advanced-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--personal-color-blue, #2563eb);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.advanced-filter-btn:hover {
  background-color: #1d4ed8;
}
.advanced-filter-btn.active {
  background-color: #1e3a8a;
}
.advanced-filter-btn svg {
  width: 24px;
  height: 24px;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #4b5563;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}
.reset-btn:hover {
  background-color: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}
.reset-btn svg {
  width: 20px;
  height: 20px;
}

.advanced-panel {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #cbd5e1;
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.price-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.price-group label {
  font-size: 13px;
  font-weight: bold;
  color: #4b5563;
}

.input-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-range input {
  width: 110px;
  height: 40px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  outline: none;
}
.input-range input:focus {
  border-color: var(--personal-color-blue, #2563eb);
}

.apply-btn {
  height: 40px;
  padding: 0 24px;
  background-color: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.apply-btn:hover {
  background-color: #059669;
}
</style>
