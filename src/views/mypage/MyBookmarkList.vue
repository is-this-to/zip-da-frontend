<script setup>
import { computed, onMounted, ref } from "vue";
import { getMyBookmarkList } from "../../api/bookmarkApi";

const bookmarkList = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const countText = computed(() => `${bookmarkList.value.length}개`);

const number = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  return new Intl.NumberFormat("ko-KR").format(Number(value));
};

const typeLabel = {
  ONE_ROOM: "원룸",
  TWO_ROOM: "투룸",
  OFFICETEL: "오피스텔",
  VILLA: "빌라",
  HOUSE: "주택",
};

const transactionLabel = {
  SALE: "매매",
  JEONSE: "전세",
  MONTHLY_RENT: "월세",
  SHORT_TERM: "단기",
};

const priceText = (bookmark) => {
  if (bookmark.transactionType === "SALE") {
    return `매매 ${number(bookmark.price)}`;
  }

  if (bookmark.transactionType === "JEONSE") {
    return `전세 ${number(bookmark.deposit)}`;
  }

  return `월세 ${number(bookmark.deposit)} / ${number(bookmark.monthlyRent)}`;
};

const fetchBookmarkList = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const result = await getMyBookmarkList();
    bookmarkList.value = result.data ?? [];
  } catch (error) {
    console.error("찜 목록 조회 실패:", error);
    bookmarkList.value = [];
    errorMessage.value =
      error.response?.data?.message || "찜 목록을 불러오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchBookmarkList);
</script>

<template>
  <section class="bookmark-page">
    <div class="page-head">
      <span>MY FAVORITES</span>
      <h1>마이 찜 리스트</h1>
      <p>관심 있게 본 매물을 한곳에서 확인하세요.</p>
    </div>

    <div class="list-title">
      <h2>찜한 매물 <b>{{ countText }}</b></h2>
    </div>

    <div v-if="isLoading" class="state-card">찜 목록을 불러오는 중입니다…</div>

    <div v-else-if="errorMessage" class="state-card error">
      <b>조회 실패</b>
      <p>{{ errorMessage }}</p>
      <button type="button" @click="fetchBookmarkList">다시 조회</button>
    </div>

    <div v-else-if="bookmarkList.length === 0" class="empty-card">
      <div class="plus">＋</div>
      <b>찜한 매물이 없어요</b>
      <p>매물 목록에서 관심 매물을 찜하면 이곳에 표시됩니다.</p>
      <RouterLink to="/properties">매물 보러가기</RouterLink>
    </div>

    <div v-else class="bookmark-grid">
      <RouterLink
        v-for="bookmark in bookmarkList"
        :key="bookmark.propertyId"
        :to="`/properties/${bookmark.propertyId}`"
        class="bookmark-card"
      >
        <div class="thumbnail-wrap">
          <img
            v-if="bookmark.thumbnailUrl"
            :src="bookmark.thumbnailUrl"
            alt="매물 이미지"
            class="bookmark-thumbnail"
          />
          <div v-else class="no-image">ZIPDA</div>
        </div>

        <div class="bookmark-info">
          <strong class="price">{{ priceText(bookmark) }}</strong>
          <p class="title">
            {{ typeLabel[bookmark.propertyType] || bookmark.propertyType }} ·
            {{ transactionLabel[bookmark.transactionType] || bookmark.transactionType }}
          </p>
          <p class="detail">
            {{ bookmark.regionName || "지역 정보 없음" }}
            <template v-if="bookmark.floor"> | 층수: {{ bookmark.floor }}층</template>
            <template v-if="bookmark.areaM2"> | {{ bookmark.areaM2 }}㎡</template>
          </p>

          <div class="tags">
            <span v-if="bookmark.maintenanceFee !== null && bookmark.maintenanceFee !== undefined">
              관리비 {{ number(bookmark.maintenanceFee) }}
            </span>
            <span>상세보기</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.page-head {
  margin-bottom: 26px;
}

.page-head > span {
  color: #0064ff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.page-head h1 {
  margin: 8px 0;
  font-size: 30px;
}

.page-head p {
  color: #7b8494;
  font-size: 14px;
}

.list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.list-title h2 {
  font-size: 20px;
}

.list-title b {
  color: #0064ff;
}

.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.bookmark-card {
  overflow: hidden;
  border: 1px solid #e7eaf1;
  border-radius: 18px;
  color: inherit;
  background: #fff;
  text-decoration: none;
  box-shadow: 0 12px 30px rgba(20, 32, 54, 0.07);
  transition: 0.18s;
}

.bookmark-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(20, 32, 54, 0.12);
}

.thumbnail-wrap {
  height: 230px;
  background: #eef2f8;
}

.bookmark-thumbnail,
.no-image {
  width: 100%;
  height: 100%;
}

.bookmark-thumbnail {
  object-fit: cover;
}

.no-image {
  display: grid;
  place-items: center;
  color: #0064ff;
  font-size: 24px;
  font-weight: 900;
}

.bookmark-info {
  padding: 18px 18px 20px;
}

.price {
  display: block;
  color: #0064ff;
  font-size: 17px;
  font-weight: 900;
}

.title {
  margin-top: 8px;
  color: #263247;
  font-size: 14px;
  font-weight: 800;
}

.detail {
  margin-top: 9px;
  color: #6f7888;
  font-size: 12px;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}

.tags span {
  padding: 5px 8px;
  border-radius: 999px;
  color: #6c7688;
  background: #f0f3f9;
  font-size: 11px;
  font-weight: 800;
}

.state-card,
.empty-card {
  display: grid;
  place-items: center;
  min-height: 260px;
  padding: 40px;
  border: 1px dashed #cbd7ef;
  border-radius: 18px;
  color: #7b8494;
  background: #fff;
  text-align: center;
}

.state-card.error {
  color: #c22c3e;
  border-style: solid;
  background: #fff4f5;
}

.state-card button,
.empty-card a {
  margin-top: 12px;
  padding: 9px 13px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #0064ff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
}

.plus {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  border: 2px solid #98a5bc;
  border-radius: 50%;
  font-size: 24px;
}

.empty-card b {
  color: #4c5668;
}

.empty-card p {
  margin: 8px 0 0;
  font-size: 13px;
}

@media (max-width: 780px) {
  .bookmark-grid {
    grid-template-columns: 1fr;
  }
}
</style>
