<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import myAxios from "../../api/myAxios";
import { useRoute } from "vue-router";
import transactionTypeCodes from "../../constants/transactionTypeCode.js";
import { usePropertyShowStore } from "../../store/property/usePropertyShowStore";
import ReportModal from "./ReportModal.vue";

const route = useRoute(); // useRoute 현재 정보
const propertyShowStore = usePropertyShowStore();
const { transactionType, getTransactionTypeName } = transactionTypeCodes;

// -- 신고하기 --
const isReportModalOpen = ref(false);

function openModal() {
  isReportModalOpen.value = true;
}
// -----

onBeforeMount(async () => {
  try {
    // URL에서 매물 ID 추출
    const propertyId = route.params.propertyId;

    await propertyShowStore.getProperty(propertyId);
  } catch (error) {
    // myErrorStore.setErrorInfo(error);  TODO:구현하기
    // router.replace("/error");    TODO:구현하기
  }
});
// BeforeUnmount(propertyShowStore.clearPropertyShow); // 최근 봤던 게시글 상세페이지 잠깐 보이는 현상 방지
</script>

<template>
  <div class="detail-area" v-if="propertyShowStore.property">
    <div class="image-section">
      <img src="https://picsum.photos/seed/room1/1200/800" alt="매물 사진" />

      <div class="photo-badge">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span>1/20</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="header-section">
        <div class="title-wrap">
          <!-- <h1 class="price-title">{{ property.priceTitle }}</h1> -->
          <h1 class="price-title">
            {{
              getTransactionTypeName(propertyShowStore.property.transactionType)
            }}
            {{ propertyShowStore.property.deposit }}/
            {{ propertyShowStore.property.monthlyRent }}
          </h1>
          <h1 class="price-title">
            {{ propertyShowStore.property.deposit }}
          </h1>
          <p class="address-text">
            {{ propertyShowStore.property.address }}
          </p>
        </div>
        <button class="heart-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="spec-grid">
        <div class="spec-item">
          <p class="spec-label">공급/전용</p>
          <p class="spec-value">{{ propertyShowStore.property.areaM2 }}m²</p>
        </div>
        <div class="spec-item">
          <p class="spec-label">방/욕실</p>
          <p class="spec-value">
            {{ propertyShowStore.property.roomCount }}/{{
              propertyShowStore.property.bathroomCount
            }}개
          </p>
        </div>
        <div class="spec-item">
          <p class="spec-label">층</p>
          <p class="spec-value">
            {{ propertyShowStore.property.floor }}
          </p>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">매물 설명</h3>
        <div class="info-card">
          <p class="description-text">
            {{ propertyShowStore.property.description }}
          </p>

          <div class="feature-grid">
            <div
              v-for="(feature, index) in propertyShowStore.property.options"
              :key="index"
              class="feature-item"
            >
              <svg
                v-if="feature.optionValue || feature.optionValue == 'Y'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {{ feature.optionName }}
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">관리비</h3>
        <div class="info-card maintenance-card">
          <p class="maintenance-label">월 관리비</p>
          <p class="maintenance-price">
            {{ propertyShowStore.property.maintenanceFee }}
          </p>
          <!-- <p class="maintenance-desc">{{ property.maintenanceDetails }}</p> -->
        </div>
      </div>

      <button class="report-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <!-- 신고하기 모달 -->
        <span @click="openModal"> 신고하기 </span>
      </button>
    </div>

    <div class="sticky-bottom-bar">
      <div class="agent-card">
        <div class="agent-profile">
          <div class="agent-avatar">
            <img
              src="https://picsum.photos/seed/agent/100/100"
              alt="공인중개사"
            />
          </div>
          <div class="agent-info">
            <!-- <h4>{{ property.agent.name }}</h4>
              <p>{{ property.agent.title }}</p> -->
          </div>
        </div>

        <div class="action-buttons">
          <button class="chat-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </button>
          <button class="contact-btn">Contact Agent</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 신고하기 모달 -->
  <ReportModal
    :visible="isReportModalOpen"
    @close="isReportModalOpen = false"
  />
</template>

<style scoped>
.detail-area {
  width: 100%;
  background-color: #f8f9fa;
  position: relative;
  height: 100vh;
  overflow-y: auto;
}

/* ==========================================
  내부 요소 디테일
   ========================================== */
.image-section {
  position: relative;
  width: 100%;
  height: 16rem;
  background-color: #e5e7eb;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.photo-badge svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #4b5563;
}

.photo-badge span {
  font-size: 0.875rem;
  font-weight: bold;
}

.content-wrapper {
  padding: 2rem 1.5rem 8rem 1.5rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.price-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.address-text {
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.heart-btn {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.25rem 0;
  margin-bottom: 2.5rem;
}

.spec-item {
  text-align: center;
  border-right: 1px solid #e5e7eb;
}

.spec-item:last-child {
  border-right: none;
}

.spec-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.spec-value {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0;
}

.info-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.info-card {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.description-text {
  color: #4b5563;
  line-height: 1.625;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.feature-item svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
  margin-right: 0.5rem;
}

.maintenance-card {
  width: 100%;
}

.maintenance-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.maintenance-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 0.5rem 0;
}

.maintenance-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.report-btn {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.report-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.25rem;
}

/* ==========================================
  하단 중개사 연락 바 (Sticky Bottom)
   ========================================== */
.sticky-bottom-bar {
  position: sticky;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  padding: 0 1.5rem;
  pointer-events: none;
}

.agent-card {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: auto;
}

.agent-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.agent-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agent-info h4 {
  font-weight: bold;
  color: #111827;
  margin: 0;
  font-size: 0.95rem;
}

.agent-info p {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #eff6ff;
  color: #2563eb;
  border: none;
  cursor: pointer;
}

.chat-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.contact-btn {
  padding: 0.625rem 1.25rem;
  background-color: #2563eb;
  color: #ffffff;

  font-weight: bold;
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
</style>
