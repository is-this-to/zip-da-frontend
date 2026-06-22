<script setup>
import { onMounted, ref } from "vue";
import { getMyBookmarkList } from "../../api/bookmarkApi";

const bookmarkList = ref([]);
const isLoading = ref(false);

const fetchBookmarkList = async () => {
  try {
    isLoading.value = true;
    const result = await getMyBookmarkList();

    bookmarkList.value = result.data ?? [];
  } catch (error) {
    console.error("찜 목록 조회 실패:", error);
    bookmarkList.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBookmarkList();
});
</script>

<template>
  <section class="bookmark-page">
    <RouterLink
      to="/mypage"
      class="bookmark-page"
      aria-label="마이페이지로 이동"
    >
      <strong>ZIPDA</strong>
    </RouterLink>
    <!-- 제목 -->
    <h2>찜 목록</h2>

    <!-- 로딩 중 -->
    <p v-if="isLoading">찜 목록을 불러오는 중입니다...</p>

    <!-- 로딩 끝났고 찜 목록이 없을 때 -->
    <p v-else-if="bookmarkList.length === 0">찜한 매물이 없습니다.</p>

    <!-- 찜 목록이 있을 때 -->
    <div v-else class="bookmark-list">
      <div
        v-for="bookmark in bookmarkList"
        :key="bookmark.propertyId"
        class="bookmark-card"
      >
        <img
          :src="bookmark.thumbnailUrl"
          alt="매물 이미지"
          class="bookmark-thumbnail"
        />

        <div class="bookmark-info">
          <p class="region-name">{{ bookmark.regionName }}</p>

          <p class="property-type">
            {{ bookmark.propertyType }} / {{ bookmark.transactionType }}
          </p>

          <p class="price">가격 {{ bookmark.price }}</p>

          <p class="rent">
            보증금 {{ bookmark.deposit }} / 월세 {{ bookmark.monthlyRent }}
          </p>

          <p class="detail">{{ bookmark.areaM2 }}㎡ · {{ bookmark.floor }}층</p>

          <p class="maintenance">관리비 {{ bookmark.maintenanceFee }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bookmark-page {
  padding: 24px;
}

.bookmark-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bookmark-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.bookmark-thumbnail {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.bookmark-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.region-name {
  font-weight: 700;
}

.price {
  font-weight: 700;
}
</style>
