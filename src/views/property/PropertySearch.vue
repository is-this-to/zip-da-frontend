<script setup>
import { computed, onMounted } from "vue";
import { usePropertySearchStore } from "../../store/property/usePropertySearchStore";

const propertySearchStore = usePropertySearchStore();

// --- 페이지네이션 로직 ---
const pageBlockSize = 5;

const totalPages = computed(() => {
  if (propertySearchStore.pageSize === 0) return 0;
  return Math.ceil(propertySearchStore.total / propertySearchStore.pageSize);
});

const startPage = computed(() => {
  return (
    Math.floor((propertySearchStore.currentPage - 1) / pageBlockSize) *
      pageBlockSize +
    1
  );
});

const endPage = computed(() => {
  let end = startPage.value + pageBlockSize - 1;
  return end > totalPages.value ? totalPages.value : end;
});

const visiblePages = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  if (page === propertySearchStore.currentPage) return;
  propertySearchStore.searchPropertyPagination(page);
};

onMounted(() => {
  propertySearchStore.searchPropertyPagination(1);
});
</script>

<template>
  <div class="property-container">
    <div class="summary">
      <p>
        총 <strong class="highlight">{{ propertySearchStore.total }}</strong
        >개의 매물이 있습니다
      </p>
    </div>

    <div class="card-container">
      <div
        class="card-wrapper"
        v-for="item in propertySearchStore.items"
        :key="item.propertyId"
        :style="{ backgroundImage: `url(${item.thumbnailUrl})` }"
      >
        <div class="info-box">
          <h3 class="price">
            {{ item.transactionType === "JEONSE" ? "전세" : "월세" }}
            {{ item.deposit }} / {{ item.monthlyRent }}
          </h3>
          <p class="desc">{{ item.description }}</p>
          <p class="sub-info">
            {{ item.regionName }} | 층수: {{ item.floor }}층 |
            {{ item.areaM2 }}㎡
          </p>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button
        @click="changePage(propertySearchStore.currentPage - 1)"
        :disabled="propertySearchStore.currentPage === 1"
      >
        &lt; 이전
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: propertySearchStore.currentPage === page }"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(propertySearchStore.currentPage + 1)"
        :disabled="propertySearchStore.lastPage || totalPages === 0"
      >
        다음 &gt;
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.property-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.summary {
  margin-bottom: 20px;
  font-size: 16px;
}

/* 지정하신 글로벌 컬러 사용 */
.highlight {
  color: var(--personal-color-blue);
}

/* 그리드 로직 */
.card-container {
  padding: 10px 0;
  gap: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  margin-bottom: 40px;
}

/* 카드 배경 및 정렬 로직 (이미지 태그 없이 처리) */
.card-wrapper {
  border: 1px solid var(--personal-color-periwinkle);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  /* 배경 이미지 관련 설정 */
  background-color: var(--personal-color-white);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  /* 카드 높이 및 텍스트 하단 배치 */
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* 텍스트 정보 영역 (배경 이미지 위에서 잘 보이도록 처리) */
.info-box {
  padding: 16px;
  background: rgba(255, 255, 255, 0.85); /* 반투명 배경 */
  backdrop-filter: blur(4px); /* 블러 효과 */
  border-top: 1px solid var(--personal-color-periwinkle);
}

.price {
  margin: 0 0 8px 0;
  color: var(--personal-color-blue);
  font-size: 18px;
}

.desc {
  font-weight: bold;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-info {
  font-size: 12px;
  color: var(--personal-color-gray);
  margin: 0;
}

/* 페이지네이션 버튼 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid var(--personal-color-periwinkle);
  background-color: var(--personal-color-white);
  color: var(--personal-color-gray);
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 현재 페이지 하이라이트 */
.pagination button.active {
  background-color: var(--personal-color-blue);
  color: var(--personal-color-white);
  border-color: var(--personal-color-blue);
  font-weight: bold;
}
</style>
