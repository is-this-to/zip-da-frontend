<script setup>
import { onMounted, ref } from "vue";
import { getMyReports } from "../../api/myPageApi";

const reports = ref([]);
const loading = ref(true);
const errorMessage = ref("");

const statusLabel = {
  RECEIVED: "접수",
  IN_PROGRESS: "처리 중",
  RESOLVED: "처리 완료",
  PENDING: "대기",
};

const loadReports = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";
    const result = await getMyReports();
    reports.value = Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "신고 내역 API가 아직 연결되지 않았습니다.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadReports);
</script>

<template>
  <section>
    <div class="page-head">
      <span>MY REPORTS</span>
      <h1>신고 내역</h1>
      <p>내가 접수한 신고 내역과 처리 상태를 확인하세요.</p>
    </div>

    <div v-if="loading" class="state">신고 내역을 불러오는 중입니다…</div>

    <div v-else-if="errorMessage" class="state error">
      <b>신고 내역을 불러오지 못했어요</b>
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadReports">다시 시도</button>
    </div>

    <div v-else-if="reports.length === 0" class="state">
      <b>신고 내역이 없어요</b>
      <p>접수한 신고가 있으면 이곳에 표시됩니다.</p>
    </div>

    <div v-else class="report-list">
      <article v-for="report in reports" :key="report.reportId" class="report-card">
        <div>
          <strong>{{ report.reason || "신고 사유 없음" }}</strong>
          <p>매물 번호 {{ report.propertyId }}</p>
          <small>{{ report.createdAt?.slice(0, 10) || "-" }}</small>
        </div>
        <span>{{ statusLabel[report.status] || report.status }}</span>
      </article>
    </div>
  </section>
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
.report-list {
  display: grid;
  gap: 12px;
}
.report-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e7eaf1;
  border-radius: 12px;
  background: #fff;
}
.report-card strong {
  color: #263247;
}
.report-card p {
  margin-top: 6px;
  color: #687284;
  font-size: 13px;
}
.report-card small {
  display: block;
  margin-top: 8px;
  color: #929baa;
  font-size: 11px;
}
.report-card span {
  flex: 0 0 auto;
  padding: 7px 10px;
  border-radius: 999px;
  color: #0064ff;
  background: #e8f1ff;
  font-size: 12px;
  font-weight: 900;
}
.state {
  display: grid;
  gap: 8px;
  place-items: center;
  min-height: 240px;
  padding: 35px;
  border: 1px dashed #cbd7ef;
  border-radius: 14px;
  color: #7b8494;
  background: #fff;
  text-align: center;
}
.state button {
  padding: 8px 12px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #0064ff;
  font-size: 12px;
  font-weight: 900;
}
.state.error {
  color: #bd2635;
  background: #fff4f5;
}
</style>
