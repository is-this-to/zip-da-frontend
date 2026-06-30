<script setup>
import { computed, onMounted } from "vue";
import { useAdminReportStore } from "../../store/admin/useAdminReportStore";
import { useRouter } from "vue-router";
import propertyTypeCodes from "../../constants/propertyType.js";
import reportTypeCodes from "../../constants/reportType.js";
import reportStatusCodes from "../../constants/reportStatusCode.js";

const router = useRouter();
const adminReportStore = useAdminReportStore();
const { propertyType, getPropertyTypeName } = propertyTypeCodes;
const { reportType, getReportTypeName } = reportTypeCodes;
const { reportStatus, getReportStatusName } = reportStatusCodes;

// --- 페이지네이션 로직 START---
const pageBlockSize = 5;

const totalPages = computed(() => {
  if (adminReportStore.pageSize === 0) return 0;
  return Math.ceil(adminReportStore.total / adminReportStore.pageSize);
});

const startPage = computed(() => {
  return (
    Math.floor((adminReportStore.currentPage - 1) / pageBlockSize) *
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
  if (page === adminReportStore.currentPage) return;
  adminReportStore.getReport(page);
};
// --- 페이지네이션 로직 END---

// 반려 버튼 클릭 시 실행
const handleReject = async (reportId, propertyId) => {
  await adminReportStore.setStatus(reportId, "REJECTED", propertyId);
};

// 삭제 버튼 클릭 시 실행
const handleDelete = async (reportId, propertyId) => {
  await adminReportStore.setStatus(reportId, "DELETED", propertyId);
};

// 매물상세 이동
const handleProperty = (propertyId) => {
  router.push(`/properties/${propertyId}`);
};

onMounted(() => {
  adminReportStore.getReport(1);
});
</script>

<template>
  <div class="admin-layout">
    <!-- 왼쪽 사이드바 -->
    <aside class="sidebar">
      <!-- 로고 영역 -->
      <div class="logo-area">
        <h1>Zip-da</h1>
        <p>Admin</p>
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="nav-menu">
        <RouterLink to="/admin/reports" class="nav-item active">
          <span class="nav-icon">▣</span>
          <span>신고관리</span>
        </RouterLink>
        <RouterLink to="/admin/dashboard" class="nav-item">
          <span class="nav-icon">▦</span>
          <span>매물관리</span>
        </RouterLink>
        <RouterLink to="/admin/users" class="nav-item">
          <span class="nav-icon">👥</span>
          <span>회원관리</span>
        </RouterLink>
      </nav>

      <!-- 관리자 정보 -->
      <div class="admin-profile">
        <div class="profile-icon">👤</div>
        <!-- <div>
          <strong>관리자01</strong>
          <p>admin@zip-da.com</p>
        </div> -->
      </div>
    </aside>

    <!-- 오른쪽 메인 영역 -->
    <main class="main-content">
      <!-- 페이지 제목 -->
      <section class="page-header">
        <h2>신고 관리</h2>
        <p>신고된 매물을 검토하고 적절한 조치를 취할 수 있습니다.</p>
      </section>

      <!-- 신고 리스트 카드 -->
      <section class="report-card">
        <div class="card-header">
          <h3>신고 리스트</h3>
        </div>

        <!-- 테이블 -->
        <div class="table-wrap">
          <table class="report-table">
            <thead>
              <tr>
                <th>매물정보 / 주소</th>
                <th>신고유형</th>
                <th>신고사유</th>
                <th>신고자</th>
                <th>신고일자</th>
                <th>횟수</th>
                <th>신고상태</th>
                <th>조치</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in adminReportStore.items" :key="item.reportId">
                <!-- 매물 정보 / 주소 -->
                <td>
                  <div
                    class="property-info"
                    @click="handleProperty(item.propertyId)"
                  >
                    <!-- <img :src="item.thumbnailUrl" class="property-image" /> -->
                    <div class="property-text">
                      <!-- <strong>{{ item.propertyName }}</strong> -->
                      <p>{{ item.address }}</p>
                      <span>
                        {{ getPropertyTypeName(item.propertyType) }} |
                        {{ item.areaM2 }}㎡ | {{ item.floor }}층
                      </span>
                    </div>
                  </div>
                </td>
                <!-- 신고 유형 -->
                <td>
                  {{ getReportTypeName(item.reportType) }}
                </td>
                <!-- 신고 사유 -->
                <td>
                  {{ item.reason }}
                </td>
                <!-- 신고자 -->
                <td>
                  {{ item.reporter }}
                </td>
                <!-- 신고 일자 -->
                <td>
                  {{ item.reportDate }}
                </td>
                <!-- 신고 횟수 -->
                <td class="count-text">
                  {{ item.countByProperty }}
                </td>
                <!-- 신고 상태 -->
                <td>
                  <span :class="['status-badge', item.status]">
                    <span class="status-dot"></span>
                    {{ getReportStatusName(item.status) }}
                  </span>
                </td>
                <!-- 조치 버튼 -->
                <td>
                  <div class="action-buttons" v-if="item.status == 'RECEIVED'">
                    <button
                      type="button"
                      class="reject-button"
                      @click="handleReject(item.reportId, item.propertyId)"
                    >
                      반려
                    </button>

                    <button
                      type="button"
                      class="delete-button"
                      @click="handleDelete(item.reportId, item.propertyId)"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <!-- <div class="pagination">
          <button type="button" class="page-button" @click="goPrevPage">
            ‹
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            :class="['page-button', { active: currentPage === page }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>

          <button type="button" class="page-button" @click="goNextPage">
            ›
          </button>
        </div> -->
        <!-- 페이지네이션 -->
        <div class="pagination">
          <button
            @click="changePage(adminReportStore.currentPage - 1)"
            :disabled="adminReportStore.currentPage === 1"
          >
            &lt; 이전
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="{ active: adminReportStore.currentPage === page }"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(adminReportStore.currentPage + 1)"
            :disabled="adminReportStore.lastPage || totalPages === 0"
          >
            다음 &gt;
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  color: #1f2937;
}

/* 왼쪽 사이드바 */
.sidebar {
  width: 280px;
  min-height: 100vh;
  padding: 36px 20px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

/* 로고 영역 */
.logo-area {
  margin-bottom: 56px;
  padding-left: 12px;
}

.logo-area h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
}

.logo-area p {
  margin: 4px 0 0;
  font-size: 16px;
  color: #64748b;
}

/* 네비게이션 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 14px;
  color: #334155;
  text-decoration: none;
  font-size: 17px;
  font-weight: 700;
  transition: 0.2s;
}

.nav-item:hover {
  background-color: #eef4ff;
  color: #2563eb;
}

.nav-item.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
}

.nav-icon {
  width: 24px;
  text-align: center;
  font-size: 20px;
}

/* 관리자 프로필 */
.admin-profile {
  margin-top: auto;
  padding: 18px;
  border-radius: 18px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-profile strong {
  font-size: 15px;
  color: #111827;
}

.admin-profile p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

/* 메인 영역 */
.main-content {
  flex: 1;
  padding: 48px 56px;
}

/* 페이지 제목 */
.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #111827;
}

.page-header p {
  margin: 10px 0 0;
  font-size: 17px;
  color: #64748b;
}

/* 신고 리스트 카드 */
.report-card {
  background-color: #ffffff;
  border-radius: 22px;
  padding: 30px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.card-header {
  margin-bottom: 24px;
}

.card-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

/* 테이블 감싸는 영역 */
.table-wrap {
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  overflow: hidden;
}

/* 신고 테이블 */
.report-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.report-table thead {
  background-color: #f8fafc;
}

.report-table th {
  padding: 18px 20px;
  text-align: left;
  font-size: 15px;
  font-weight: 800;
  color: #475569;
  border-bottom: 1px solid #dbe3ef;
}

.report-table td {
  padding: 20px;
  font-size: 16px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

/* 컬럼 너비 */
.report-table th:nth-child(1),
.report-table td:nth-child(1) {
  width: 20%;
}

.report-table th:nth-child(2),
.report-table td:nth-child(2) {
  width: 10%;
}

.report-table th:nth-child(3),
.report-table td:nth-child(3) {
  width: 25%;
  text-align: center;
}

.report-table th:nth-child(4),
.report-table td:nth-child(4) {
  width: 10%;
  text-align: center;
}

.report-table th:nth-child(5),
.report-table td:nth-child(5) {
  width: 8%;
  text-align: center;
}

.report-table th:nth-child(6),
.report-table td:nth-child(6) {
  width: 6%;
  text-align: center;
}

.report-table th:nth-child(7),
.report-table td:nth-child(7) {
  width: 8%;
  text-align: center;
}

.report-table th:nth-child(8),
.report-table td:nth-child(8) {
  width: 13%;
  text-align: center;
}

/* 매물 정보 */
.property-info {
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
}

.property-image {
  width: 92px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #e5e7eb;
}

.property-text strong {
  display: block;
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
}

.property-text p {
  margin: 0 0 6px;
  font-size: 14px;
  color: #475569;
}

.property-text span {
  font-size: 13px;
  color: #64748b;
}

.count-text {
  font-weight: 800;
  color: #2563eb;
}

/* 신고 상태 뱃지 */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 92px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* 접수 상태 */
.status-received {
  background-color: #dcfce7;
  color: #15803d;
}

.status-received .status-dot {
  background-color: #22c55e;
}

/* 검토중 상태 */
.status-reviewing {
  background-color: #ffedd5;
  color: #c2410c;
}

.status-reviewing .status-dot {
  background-color: #f97316;
}

/* 처리완료 상태 */
.status-completed {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-completed .status-dot {
  background-color: #2563eb;
}

/* 조치 버튼 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.action-buttons button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.reject-button {
  background-color: #f1f5f9;
  color: #111827;
  border: 1px solid #dbe3ef;
}

.reject-button:hover {
  background-color: #e2e8f0;
}

.delete-button {
  background-color: #fee2e2;
  color: #dc2626;
}

.delete-button:hover {
  background-color: #fecaca;
}

/* 페이지네이션 버튼 */
.pagination {
  margin-top: 26px;
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

/* 페이지네이션
.pagination {
  margin-top: 26px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.page-button {
  width: 44px;
  height: 44px;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background-color: #ffffff;
  color: #334155;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.page-button:hover {
  background-color: #eef4ff;
  color: #2563eb;
}

.page-button.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
} */

/* 작은 화면 대응 */
@media (max-width: 1100px) {
  .sidebar {
    width: 230px;
  }

  .main-content {
    padding: 36px 28px;
  }

  .report-table {
    min-width: 1000px;
  }

  .table-wrap {
    overflow-x: auto;
  }
}
</style>
