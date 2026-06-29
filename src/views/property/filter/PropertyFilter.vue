<script setup>
import { onMounted } from "vue";

import { usePropertySearchStore } from "../../../store/property/usePropertySearchStore";
import { useRegionStore } from "../../../store/region/useRegionStore";
import { usePriceFilter } from "../../../composable/usePriceFilter";

import transactionTypeCode from "../../../constants/transactionTypeCode";
import propertyType from "../../../constants/propertyType";

const store = usePropertySearchStore();
const regionStore = useRegionStore();

// 가격 필터 Composable
const {
  localPrices,
  isAdvancedOpen,
  toggleAdvancedFilter,
  applyPrices,
  resetLocalPrices,
} = usePriceFilter();

// -----------------------------
// 초기 로딩
// -----------------------------
onMounted(() => {
  regionStore.fetchProvinces();
});

// -----------------------------
// 일반 검색
// -----------------------------
const handleSearch = () => {
  store.searchFilters.regionId = regionStore.selectedDistrict;
  store.searchPropertyPagination(1);
};

// -----------------------------
// 시/도 선택
// -----------------------------
const handleProvinceChange = async () => {
  await regionStore.fetchCities(regionStore.selectedProvince);

  store.searchFilters.regionId = null;
  store.searchPropertyPagination(1);
};

// -----------------------------
// 시/군/구 선택
// -----------------------------
const handleCityChange = async () => {
  await regionStore.fetchDistricts(
    regionStore.selectedProvince,
    regionStore.selectedCity,
  );

  store.searchFilters.regionId = null;
  store.searchPropertyPagination(1);
};

// -----------------------------
// 읍/면/동 선택
// -----------------------------
const handleDistrictChange = () => {
  store.searchFilters.regionId = regionStore.selectedDistrict;
  store.searchPropertyPagination(1);
};

// -----------------------------
// 거래유형 변경
// -----------------------------
const handleTransactionChange = () => {
  store.searchFilters.minPrice = null;
  store.searchFilters.maxPrice = null;
  store.searchFilters.minDeposit = null;
  store.searchFilters.maxDeposit = null;
  store.searchFilters.minMonthlyRent = null;
  store.searchFilters.maxMonthlyRent = null;

  resetLocalPrices();

  store.searchPropertyPagination(1);
};

// -----------------------------
// 전체 초기화
// -----------------------------
const resetFilter = () => {
  store.resetFilters();
  resetLocalPrices();
  regionStore.resetRegion();

  regionStore.fetchProvinces();

  store.searchPropertyPagination(1);
};
</script>

<template>
  <div class="filter-wrapper">
    <div class="top-row">
      <!-- ===========================
           지역 선택
      ============================ -->
      <div class="region-select-box">
        <!-- 시/도 -->
        <select
          class="custom-select"
          v-model="regionStore.selectedProvince"
          @change="handleProvinceChange"
        >
          <option value="">시 / 도</option>

          <option
            v-for="province in regionStore.provinces"
            :key="province"
            :value="province"
          >
            {{ province }}
          </option>
        </select>

        <!-- 시/군/구 -->
        <select
          class="custom-select"
          v-model="regionStore.selectedCity"
          @change="handleCityChange"
          :disabled="!regionStore.selectedProvince"
        >
          <option value="">시 / 군 / 구</option>

          <option v-for="city in regionStore.cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>

        <!-- 읍/면/동 -->
        <select
          class="custom-select"
          v-model="regionStore.selectedDistrict"
          @change="handleDistrictChange"
          :disabled="!regionStore.selectedCity"
        >
          <option :value="null">읍 / 면 / 동</option>

          <option
            v-for="district in regionStore.districts"
            :key="district.regionId"
            :value="district.regionId"
          >
            {{ district.regionName }}
          </option>
        </select>
      </div>

      <!-- ===========================
           매물 유형
      ============================ -->
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

      <!-- ===========================
           거래 유형
      ============================ -->
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

      <!-- ===========================
           상태
      ============================ -->
      <select
        class="custom-select"
        v-model="store.searchFilters.status"
        @change="handleSearch"
      >
        <option :value="null">상태 (전체)</option>
        <option value="FOR_SALE">판매중</option>
        <option value="COMPLETED">거래완료</option>
      </select>

      <!-- ===========================
           상세 가격 버튼
      ============================ -->
      <button
        class="advanced-filter-btn"
        @click="toggleAdvancedFilter"
        :class="{ active: isAdvancedOpen }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </button>

      <!-- ===========================
           초기화
      ============================ -->
      <button class="reset-btn" @click="resetFilter">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </div>

    <!-- ===========================
         상세 가격 필터
    ============================ -->
    <div class="advanced-panel" v-if="isAdvancedOpen">
      <!-- 매매 -->
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
          />

          <span>~</span>

          <input
            type="number"
            v-model="localPrices.maxPrice"
            placeholder="최대"
          />
        </div>
      </div>

      <!-- 보증금 -->
      <div
        class="price-group"
        v-if="store.searchFilters.transactionType !== 'SALE'"
      >
        <label>보증금 / 전세가 (만원)</label>

        <div class="input-range">
          <input
            type="number"
            v-model="localPrices.minDeposit"
            placeholder="최소"
          />

          <span>~</span>

          <input
            type="number"
            v-model="localPrices.maxDeposit"
            placeholder="최대"
          />
        </div>
      </div>

      <!-- 월세 -->
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
          />

          <span>~</span>

          <input
            type="number"
            v-model="localPrices.maxMonthlyRent"
            placeholder="최대"
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
  flex-wrap: wrap;
}

/* ===========================
   지역 선택
=========================== */

.region-select-box {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 520px;
}

.region-select-box .custom-select {
  flex: 1;
  min-width: 150px;
}

/* ===========================
   공통 Select
=========================== */

.custom-select {
  appearance: none;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 48px;
  padding: 0 36px 0 14px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");

  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  outline: none;

  transition: 0.2s;
}

.custom-select:hover {
  border-color: #2563eb;
}

.custom-select:focus {
  border-color: #2563eb;
}

.custom-select:disabled {
  background: #f3f4f6;
  color: #999;
  cursor: not-allowed;
}

/* ===========================
   상세필터 버튼
=========================== */

.advanced-filter-btn {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 48px;
  height: 48px;

  border: none;
  border-radius: 8px;

  background: #2563eb;
  color: white;

  cursor: pointer;
  transition: 0.2s;
}

.advanced-filter-btn:hover {
  background: #1d4ed8;
}

.advanced-filter-btn.active {
  background: #1e3a8a;
}

.advanced-filter-btn svg {
  width: 22px;
  height: 22px;
}

/* ===========================
   초기화 버튼
=========================== */

.reset-btn {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 48px;
  height: 48px;

  border-radius: 8px;
  border: 1px solid #cbd5e1;

  background: white;

  cursor: pointer;

  transition: 0.2s;
}

.reset-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}

.reset-btn svg {
  width: 20px;
  height: 20px;
}

/* ===========================
   상세 가격
=========================== */

.advanced-panel {
  margin-top: 18px;
  padding-top: 18px;

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

  outline: none;
}

.input-range input:focus {
  border-color: #2563eb;
}

.apply-btn {
  height: 40px;
  padding: 0 24px;

  border: none;
  border-radius: 6px;

  background: #10b981;
  color: white;

  font-weight: bold;

  cursor: pointer;

  transition: 0.2s;
}

.apply-btn:hover {
  background: #059669;
}

/* ===========================
   반응형
=========================== */

@media (max-width: 1100px) {
  .top-row {
    flex-direction: column;
    align-items: stretch;
  }

  .region-select-box {
    min-width: auto;
    width: 100%;
  }

  .region-select-box .custom-select {
    width: 100%;
  }

  .custom-select {
    width: 100%;
  }
}
</style>
