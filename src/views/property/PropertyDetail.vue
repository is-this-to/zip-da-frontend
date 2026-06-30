<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import MyButton from "../../components/button/MyButton.vue";
import {
  getPropertyDetail,
  changePropertyStatus,
  deleteProperty,
} from "../../api/propertyApi";
import {
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  PROPERTY_STATUSES,
  SOURCE_TYPES,
  getLabel,
} from "../../constants/propertyEnums";
import { useAuthStore } from "../../store/auth/useAuthStore";
import { formatKoreanCurrency } from "../../util/formatter/useCurrency.js";
import ReportModal from "./ReportModal.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const property = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

const propertyId = computed(() => Number(route.params.propertyId));

// 백엔드 응답의 enum 객체에서 code 추출 (백엔드가 객체로 보내지만, 안전하게 string 도 대응)
const extractCode = (value) => {
  if (!value) return null;
  return typeof value === "object" ? value.code : value;
};

const propertyTypeLabel = computed(() =>
  getLabel(PROPERTY_TYPES, extractCode(property.value?.propertyType)),
);
const transactionTypeLabel = computed(() =>
  getLabel(TRANSACTION_TYPES, extractCode(property.value?.transactionType)),
);
const statusLabel = computed(() =>
  getLabel(PROPERTY_STATUSES, extractCode(property.value?.status)),
);
const sourceTypeLabel = computed(() =>
  getLabel(SOURCE_TYPES, extractCode(property.value?.sourceType)),
);

// 현재 사용자가 이 매물의 작성자인가?
const isOwner = computed(() => {
  if (!property.value || !authStore.userInfo) return false;
  return property.value.userId === authStore.userInfo.userId;
});

// 어드민인가?
const isAdmin = computed(() => authStore.role === "ADMIN");

// 수정/삭제 가능?
const canEdit = computed(() => isOwner.value || isAdmin.value);

// 신고 가능한가?
const canReport = computed(() => {
  if (!property.value || !authStore.userInfo) return false;
  if (property.value.userId === authStore.userInfo.userId) return false;
  return true;
});

// 찜 가능한가?
const canLike = computed(() => {
  if (!property.value || !authStore.userInfo) return false;
  if (property.value.userId === authStore.userInfo.userId) return false;
  return true;
});
const isFavorite = ref(false);

// 가격 표시 포맷
const formatPrice = (value) => {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("ko-KR") + "원";
};

// 금액 표시 (거래 종류에 따라)
const priceDisplay = computed(() => {
  if (!property.value) return "";
  const code = extractCode(property.value.transactionType);
  switch (code) {
    case "SALE":
      return `매매가 ${formatPrice(property.value.price)}`;
    case "JEONSE":
      return `전세 ${formatPrice(property.value.deposit)}`;
    case "MONTHLY_RENT":
      return `월세 ${formatPrice(property.value.deposit)} / ${formatPrice(property.value.monthlyRent)}`;
    case "SHORT_TERM":
      return `단기 ${formatPrice(property.value.deposit)} / ${formatPrice(property.value.monthlyRent)}`;
    default:
      return "-";
  }
});

const fetchProperty = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    property.value = await getPropertyDetail(propertyId.value);

    isFavorite.value = property.value.isFavorite; // 서버에서 가져온 찜 초기값
  } catch (error) {
    console.error("매물 상세 조회 실패:", error);
    errorMessage.value =
      error.response?.data?.message || "매물 정보를 불러올 수 없습니다.";
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = () => {
  router.push(`/properties/${propertyId.value}/edit`);
};

const handleDelete = async () => {
  if (!confirm("정말로 이 매물을 삭제하시겠습니까?")) return;
  try {
    await deleteProperty(propertyId.value);
    alert("매물이 삭제되었습니다.");
    router.push("/");
  } catch (error) {
    console.error("매물 삭제 실패:", error);
    alert(error.response?.data?.message || "삭제에 실패했습니다.");
  }
};

const handleStatusChange = async (newStatus) => {
  const label = getLabel(PROPERTY_STATUSES, newStatus);
  if (!confirm(`거래 상태를 "${label}"로 변경하시겠습니까?`)) return;
  try {
    await changePropertyStatus(propertyId.value, newStatus);
    alert("거래 상태가 변경되었습니다.");
    await fetchProperty();
  } catch (error) {
    console.error("거래상태 변경 실패:", error);
    alert(error.response?.data?.message || "변경에 실패했습니다.");
  }
};

// 신고하기
const isReportModalOpen = ref(false);
function openModal() {
  isReportModalOpen.value = true;
}

// 찜 처리
const toggleLike = async () => {
  isFavorite.value = !isFavorite.value;

  try {
    await updatePropertyFavorite(propertyId.value, isFavorite.value);
  } catch (error) {
    console.error("찜하기 처리 실패", error);
    isFavorite.value = !isFavorite.value;
    alert("찜하기 처리에 실패했습니다.");
  }
};

onMounted(() => {
  fetchProperty();
});
</script>

<template>
  <main class="page">
    <div v-if="isLoading" class="state-msg">매물 정보를 불러오는 중...</div>

    <div v-else-if="errorMessage" class="state-msg error">
      {{ errorMessage }}
    </div>

    <div v-else-if="property" class="detail">
      <!-- 이미지 갤러리 -->
      <section
        v-if="property.imageUrls && property.imageUrls.length > 0"
        class="gallery"
      >
        <img
          :src="property.imageUrls[0]"
          :alt="'대표 이미지'"
          class="main-image"
        />
        <div v-if="property.imageUrls.length > 1" class="thumbnails">
          <img
            v-for="(url, index) in property.imageUrls.slice(1)"
            :key="url"
            :src="url"
            :alt="`이미지 ${index + 2}`"
          />
        </div>
      </section>

      <!-- 상단 정보 -->
      <section class="header-info">
        <div class="title-box">
          <div class="badges">
            <span class="badge primary">{{ propertyTypeLabel }}</span>
            <span class="badge">{{ transactionTypeLabel }}</span>
            <span class="badge status">{{ statusLabel }}</span>
            <span class="badge source">{{ sourceTypeLabel }}</span>
          </div>
          <h1>{{ priceDisplay }}</h1>
          <p v-if="property.region" class="address">
            {{ property.region.province }} {{ property.region.city }}
            {{ property.region.district }}
            <span v-if="property.detailAddress">
              · {{ property.detailAddress }}</span
            >
          </p>
        </div>
        <div :visible="isReportModalOpen" class="heart-box">
          <!-- 찜 -->
          <button class="btn-heart" @click="toggleLike">
            <svg
              v-if="isFavorite"
              style="color: var(--personal-color-blue)"
              fill="currentColor"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </section>

      <!-- 매물 정보 -->
      <section class="info-section">
        <h2>매물 정보</h2>
        <dl class="info-grid">
          <div v-if="property.areaM2">
            <dt>전용면적</dt>
            <dd>{{ property.areaM2 }}㎡</dd>
          </div>
          <div v-if="property.roomCount !== null">
            <dt>방 수</dt>
            <dd>{{ property.roomCount }}개</dd>
          </div>
          <div v-if="property.bathroomCount !== null">
            <dt>욕실 수</dt>
            <dd>{{ property.bathroomCount }}개</dd>
          </div>
          <div v-if="property.floor !== null">
            <dt>층</dt>
            <dd>{{ property.floor }}층</dd>
          </div>
          <div v-if="property.moveInDate">
            <dt>입주가능일</dt>
            <dd>{{ property.moveInDate }}</dd>
          </div>
          <div v-if="property.maintenanceFee">
            <dt>관리비</dt>
            <dd>{{ formatPrice(property.maintenanceFee) }}</dd>
          </div>
        </dl>
      </section>

      <!-- 옵션 -->
      <section
        v-if="property.options && property.options.length > 0"
        class="info-section"
      >
        <h2>옵션</h2>
        <div class="options">
          <span
            v-for="opt in property.options"
            :key="opt.optionId"
            class="option-chip"
          >
            {{ opt.optionName }}
          </span>
        </div>
      </section>

      <!-- 설명 -->
      <section class="info-section">
        <h2>매물 설명</h2>
        <p class="description">{{ property.description }}</p>
      </section>

      <!-- 신고하기 -->
      <button v-if="canReport" class="btn-report">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path
            d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
            fill="#424656"
          />
        </svg>
        <span @click="openModal"> 신고하기 </span>
      </button>

      <!-- 매물 등록자정보 -->
      <div class="seller-card">
        <div class="seller-profile">
          <div
            v-if="property.agentImageUrl && property.agentImageUrl.length > 0"
            class="agent-avatar"
          >
            <img :src="property.agentImageUrl" alt="공인중개사" />
          </div>
          <div class="agent-info">
            <h4>{{ property.propertyUserNick }}</h4>
          </div>
        </div>
        <div class="chat-box">
          <button class="btn-chat">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </button>
          <button class="btn-contact">Contact Agent</button>
        </div>
      </div>

      <!-- 액션 (작성자 본인 또는 어드민만) -->
      <section v-if="canEdit" class="actions">
        <div class="status-actions">
          <span class="actions-label">거래 상태 변경:</span>
          <MyButton
            v-for="s in PROPERTY_STATUSES"
            :key="s.code"
            :content="s.label"
            :color="extractCode(property.status) === s.code ? 'blue' : 'white'"
            :size="'small'"
            :class="'btn-status'"
            @click="handleStatusChange(s.code)"
            :disabled="extractCode(property.status) === s.code"
          />
        </div>

        <div class="manage-actions">
          <MyButton
            :content="'수정'"
            :color="'white'"
            :size="'small'"
            :class="'btn-edit'"
            @click="handleEdit"
          />
          <MyButton
            :content="'삭제'"
            :color="'white'"
            :size="'small'"
            :class="'btn-delete'"
            @click="handleDelete"
          />
        </div>
      </section>
    </div>
  </main>

  <!-- 신고하기 모달 -->
  <ReportModal
    :visible="isReportModalOpen"
    @close="isReportModalOpen = false"
  />
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  color: var(--personal-color-black);
}

.state-msg {
  padding: 80px 20px;
  text-align: center;
  color: var(--personal-color-gray);
  font-size: 18px;
  font-weight: 600;
}

.state-msg.error {
  color: #e73431;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 갤러리 */
.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-image {
  width: 100%;
  max-height: 540px;
  object-fit: cover;
  border-radius: 24px;
  background: #f1f3f8;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.thumbnails img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 14px;
  background: #f1f3f8;
}

/* 상단 정보 */
.header-info {
  display: flex;
  justify-content: space-between;
  padding: 28px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(21, 32, 48, 0.04);
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  background: #eaf1ff;
  color: var(--personal-color-blue);
  font-size: 13px;
  font-weight: 800;
}

.badge.primary {
  background: var(--personal-color-blue);
  color: #ffffff;
}

.badge.status {
  background: #e6f7ec;
  color: #1aab5e;
}

.badge.source {
  background: #fff3e0;
  color: #f57c00;
}

.header-info h1 {
  margin: 0 0 8px;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  line-height: 1.2;
}

.address {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 16px;
  font-weight: 600;
}

/* 정보 섹션 */
.info-section {
  padding: 28px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(21, 32, 48, 0.04);
}

.info-section h2 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 900;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin: 0;
}

.info-grid > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-grid dt {
  color: var(--personal-color-gray);
  font-size: 13px;
  font-weight: 700;
}

.info-grid dd {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-chip {
  padding: 8px 14px;
  border-radius: 999px;
  background: #f4f8ff;
  color: var(--personal-color-blue);
  font-size: 14px;
  font-weight: 700;
}

.description {
  margin: 0;
  color: #303a4d;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  white-space: pre-line;
}

/* 찜 */
.btn-heart {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-heart svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

/* 신고하기 */
.btn-report {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.btn-report svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.25rem;
}

/* 하단 연락처 바 */
.seller-card {
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
.seller-profile {
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

/* 액션 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(21, 32, 48, 0.04);
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.actions-label {
  margin-right: 8px;
  color: var(--personal-color-gray);
  font-size: 14px;
  font-weight: 700;
}

.manage-actions {
  display: flex;
  gap: 8px;
}

.btn-status,
.btn-edit,
.btn-delete {
  padding: 0 20px;
  min-width: 90px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
}

.btn-edit,
.btn-delete {
  border: 1px solid #e3e8f2;
}

.btn-delete {
  color: #e73431;
}

.btn-delete:hover {
  background: #ffe6e5;
}

/* 채팅 버튼 */
.chat-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-chat {
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

.btn-chat svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-contact {
  padding: 0.625rem 1.25rem;
  background-color: #2563eb;
  color: #ffffff;

  font-weight: bold;
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

@media (max-width: 640px) {
  .page {
    padding: 20px 12px 60px;
  }

  .status-actions,
  .manage-actions {
    width: 100%;
  }
}
</style>
