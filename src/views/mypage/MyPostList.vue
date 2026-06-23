<script setup>
import { computed, onMounted, ref } from 'vue';
import { getMyProperties } from '../../api/mypageApi';

const posts = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const filter = ref('ALL');
const filteredPosts = computed(() =>
  filter.value === 'ALL'
    ? posts.value
    : posts.value.filter((item) => item.status === filter.value),
);
const counts = computed(() => ({
  ALL: posts.value.length,
  ACTIVE: posts.value.filter((p) => p.status === 'ACTIVE').length,
  COMPLETED: posts.value.filter((p) => p.status === 'COMPLETED').length,
  HIDDEN: posts.value.filter((p) => p.status === 'HIDDEN').length,
}));
const labels = {
  ACTIVE: '게시 중',
  COMPLETED: '거래 완료',
  HIDDEN: '숨김',
  SALE: '매매',
  JEONSE: '전세',
  MONTHLY: '월세',
  MONTHLY_RENT: '월세',
};
const number = (value) =>
  new Intl.NumberFormat('ko-KR').format(Number(value || 0));
const priceText = (item) =>
  item.transactionType?.includes('MONTHLY')
    ? `월세 ${number(item.deposit)} / ${number(item.monthlyRent)}`
    : item.transactionType === 'JEONSE'
      ? `전세 ${number(item.deposit)}`
      : `매매 ${number(item.price)}`;
const loadPosts = async () => {
  try {
    const result = await getMyProperties();
    posts.value = Array.isArray(result.data)
      ? result.data
      : (result.data?.content ?? []);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      '내 게시물 API가 아직 연결되지 않았습니다.';
  } finally {
    loading.value = false;
  }
};
onMounted(loadPosts);
</script>

<template>
  <div class="page-head">
    <span>MY LISTINGS</span>
    <h1>내 게시물</h1>
    <p>내가 등록한 매물과 현재 게시 상태를 확인하세요.</p>
  </div>
  <div class="summary-cards">
    <button
      v-for="item in [
        { key: 'ALL', label: '전체' },
        { key: 'ACTIVE', label: '게시 중' },
        { key: 'COMPLETED', label: '거래 완료' },
        { key: 'HIDDEN', label: '숨김' },
      ]"
      :key="item.key"
      :class="{ active: filter === item.key }"
      @click="filter = item.key"
    >
      <span>{{ item.label }}</span
      ><strong>{{ counts[item.key] }}</strong>
    </button>
  </div>
  <div v-if="loading" class="state">게시물을 불러오는 중입니다…</div>
  <div v-else-if="errorMessage" class="state error">
    <b>게시물을 불러오지 못했어요</b>
    <p>{{ errorMessage }}</p>
    <button @click="loadPosts">다시 시도</button>
  </div>
  <div v-else-if="!filteredPosts.length" class="state">
    <b>{{
      filter === 'ALL'
        ? '등록한 게시물이 없어요'
        : '해당 상태의 게시물이 없어요'
    }}</b>
    <p>새 매물을 등록하면 이곳에서 상태를 관리할 수 있어요.</p>
    <RouterLink to="/properties/new">매물 등록하기</RouterLink>
  </div>
  <div v-else class="post-list">
    <article
      v-for="post in filteredPosts"
      :key="post.propertyId"
      class="post-card"
    >
      <div class="thumb">
        <img
          v-if="post.thumbnailUrl"
          :src="post.thumbnailUrl"
          :alt="post.title"
        /><span v-else>ZIPDA</span>
      </div>
      <div class="info">
        <div>
          <span class="status" :class="post.status?.toLowerCase()">{{
            labels[post.status] || post.status
          }}</span
          ><small>{{ post.regionName }}</small>
        </div>
        <h2>{{ post.title || priceText(post) }}</h2>
        <p>
          {{ priceText(post) }}
          <template v-if="post.areaM2">· {{ post.areaM2 }}㎡</template>
        </p>
        <small
          >등록일 {{ post.createdAt?.slice(0, 10) || '-' }} · 조회
          {{ number(post.viewCount) }}</small
        >
      </div>
      <div class="actions">
        <RouterLink :to="`/properties/${post.propertyId}`">보기</RouterLink
        ><RouterLink :to="`/properties/${post.propertyId}/edit`"
          >수정</RouterLink
        >
      </div>
    </article>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 24px;
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
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}
.summary-cards button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  padding: 0 16px;
  border: 1px solid #e6eaf1;
  border-radius: 10px;
  color: #7a8393;
  background: #fff;
  cursor: pointer;
}
.summary-cards strong {
  color: #253148;
  font-size: 20px;
}
.summary-cards button.active {
  border-color: #0064ff;
  color: #0064ff;
  box-shadow: inset 0 0 0 1px #0064ff;
}
.summary-cards button.active strong {
  color: #0064ff;
}
.post-list {
  display: grid;
  gap: 12px;
}
.post-card {
  display: grid;
  grid-template-columns: 145px 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 14px;
  border: 1px solid #e7eaf1;
  border-radius: 12px;
  background: #fff;
}
.thumb {
  display: grid;
  place-items: center;
  height: 108px;
  overflow: hidden;
  border-radius: 8px;
  color: #9babc3;
  background: #e4eaf3;
  font-weight: 900;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info > div {
  display: flex;
  align-items: center;
  gap: 9px;
}
.info small {
  color: #929baa;
  font-size: 10px;
}
.status {
  padding: 4px 7px;
  border-radius: 5px;
  color: #08794b;
  background: #e6f7ef;
  font-size: 10px;
  font-weight: 900;
}
.status.completed {
  color: #667085;
  background: #eef0f4;
}
.status.hidden {
  color: #ad6920;
  background: #fff2df;
}
.info h2 {
  margin: 10px 0 5px;
  font-size: 16px;
}
.info p {
  margin-bottom: 8px;
  color: #687284;
  font-size: 12px;
}
.actions {
  display: flex;
  gap: 6px;
}
.actions a {
  padding: 8px 10px;
  border: 1px solid #dfe4ec;
  border-radius: 7px;
  color: #5c6678;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
}
.actions a:last-child {
  color: #0064ff;
  border-color: #b9d2ff;
}
.state {
  display: grid;
  justify-items: center;
  padding: 80px 20px;
  border: 1px dashed #d9dfe9;
  border-radius: 12px;
  color: #7b8494;
  background: #fff;
  text-align: center;
}
.state b {
  margin-bottom: 8px;
  color: #273349;
  font-size: 18px;
}
.state p {
  margin: 7px 0 18px;
  font-size: 12px;
}
.state a,
.state button {
  padding: 10px 15px;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: #0064ff;
  text-decoration: none;
  font-weight: 800;
  cursor: pointer;
}
.state.error b {
  color: #b42939;
}
@media (max-width: 700px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .post-card {
    grid-template-columns: 100px 1fr;
  }
  .actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
