<script setup>
import { computed, onMounted } from "vue";
import { useAdminReportStore } from "../../store/admin/useAdminReportStore";
import { useRouter } from "vue-router";
import propertyTypeCodes from "../../constants/propertyType.js";
import reportTypeCodes from "../../constants/reportType.js";
import reportStatusCodes from "../../constants/reportStatusCode.js";
import { useAdminAuthStore } from "../../store/auth/useAdminAuthStore.js";
import { useMyErrorStore } from "../../store/error/useMyErrorStore.js";

const router = useRouter();
const adminReportStore = useAdminReportStore();
const { propertyType, getPropertyTypeName } = propertyTypeCodes;
const { reportType, getReportTypeName } = reportTypeCodes;
const { reportStatus, getReportStatusName } = reportStatusCodes;
const authStore = useAdminAuthStore();
const myErrorStore = useMyErrorStore();
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

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.replace("/admins/sign-in");
  } catch (error) {
    if (myErrorStore.redirectErrorPage(error)) return;
  }
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
        <div class="title">ZIPDA</div>
        <p>Admin</p>
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="nav-menu">
        <RouterLink to="/admin/reports" class="nav-item active">
          <span class="nav-icon">▣</span>
          <span>신고관리</span>
        </RouterLink>
        <!-- <RouterLink to="/admin/dashboard" class="nav-item" >
          <span class="nav-icon">▦</span>
          <span>매물관리</span>
        </RouterLink>
        <RouterLink to="/admin/users" class="nav-item" >
          <span class="nav-icon">👥</span>
          <span>회원관리</span>
        </RouterLink> -->
      </nav>

      <!-- 관리자 정보 -->
      <div class="admin-profile">
        <div class="profile-icon">👤</div>
        <div class="profile-admin-name">{{ authStore.adminInfo?.name }}</div>
        <!-- <div>
          <strong>관리자01</strong>
          <p>admin@zip-da.com</p>
        </div> -->
      </div>
      <button type="button" class="logout-button" @click="handleLogout">
        로그아웃
      </button>
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  color: #1f2937;
}

.sidebar {
  width: 280px;
  min-width: 280px;
  min-height: 100vh;
  padding: 36px 20px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.logo-area {
  margin-bottom: 56px;
  padding-left: 12px;
}

.logo-area .title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
  line-height: 1.2;
}

.logo-area p {
  margin: 4px 0 0;
  font-size: 16px;
  color: #64748b;
  line-height: 1.4;
}

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
  min-width: 0;
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
  flex-shrink: 0;
  text-align: center;
  font-size: 20px;
}

.admin-profile {
  margin-top: auto;
  padding: 18px;
  border-radius: 18px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.profile-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-admin-name {
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.4;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 48px 56px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.page-header p {
  margin: 10px 0 0;
  font-size: 17px;
  color: #64748b;
  line-height: 1.6;
  word-break: keep-all;
}

.report-card {
  background-color: #ffffff;
  border-radius: 22px;
  padding: 30px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.card-header {
  margin-bottom: 24px;
}

.card-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.table-wrap {
  width: 100%;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
}

.report-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: collapse;
  table-layout: fixed;
}

.report-table thead {
  background-color: #f8fafc;
}

.report-table th {
  padding: 18px 16px;
  text-align: left;
  font-size: 15px;
  font-weight: 800;
  color: #475569;
  border-bottom: 1px solid #dbe3ef;
  white-space: nowrap;
}

.report-table td {
  padding: 18px 16px;
  font-size: 15px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

.report-table th:nth-child(1),
.report-table td:nth-child(1) {
  width: 24%;
}

.report-table th:nth-child(2),
.report-table td:nth-child(2) {
  width: 10%;
  text-align: center;
}

.report-table th:nth-child(3),
.report-table td:nth-child(3) {
  width: 18%;
  text-align: center;
}

.report-table th:nth-child(4),
.report-table td:nth-child(4) {
  width: 10%;
  text-align: center;
}

.report-table th:nth-child(5),
.report-table td:nth-child(5) {
  width: 11%;
  text-align: center;
}

.report-table th:nth-child(6),
.report-table td:nth-child(6) {
  width: 7%;
  text-align: center;
}

.report-table th:nth-child(7),
.report-table td:nth-child(7) {
  width: 10%;
  text-align: center;
}

.report-table th:nth-child(8),
.report-table td:nth-child(8) {
  width: 10%;
  text-align: center;
}

.property-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  min-width: 0;
}

.property-image {
  width: 92px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.property-text {
  min-width: 0;
}

.property-text strong {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.4;
}

.property-text p {
  margin: 0 0 6px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  word-break: break-word;
}

.property-text span {
  display: block;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  word-break: break-word;
}

.count-text {
  font-weight: 800;
  color: #2563eb;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 92px;
  max-width: 100%;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-received {
  background-color: #dcfce7;
  color: #15803d;
}

.status-received .status-dot {
  background-color: #22c55e;
}

.status-reviewing {
  background-color: #ffedd5;
  color: #c2410c;
}

.status-reviewing .status-dot {
  background-color: #f97316;
}

.status-completed {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-completed .status-dot {
  background-color: #2563eb;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons button {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
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

.pagination {
  margin-top: 26px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination button {
  min-width: 40px;
  padding: 8px 12px;
  border: 1px solid var(--personal-color-periwinkle);
  background-color: var(--personal-color-white);
  color: var(--personal-color-gray);
  cursor: pointer;
  border-radius: 8px;
  font-weight: 700;
  white-space: nowrap;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: var(--personal-color-blue);
  color: var(--personal-color-white);
  border-color: var(--personal-color-blue);
  font-weight: 800;
}

.logout-button {
  margin-top: 12px;
  width: 100%;
  height: 48px;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  background-color: #ffffff;
  color: #475569;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.logout-button:hover {
  background-color: #eef4ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.logout-button:active {
  transform: translateY(1px);
}

@media (max-width: 1280px) {
  .sidebar {
    width: 240px;
    min-width: 240px;
    padding: 28px 16px;
  }

  .main-content {
    padding: 36px 28px;
  }

  .page-header h2 {
    font-size: 30px;
  }

  .report-card {
    padding: 22px;
  }
}

@media (max-width: 1024px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 20px 16px;
  }

  .logo-area {
    margin-bottom: 24px;
    padding-left: 0;
  }

  .nav-menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-item {
    padding: 12px 16px;
    font-size: 15px;
  }

  .admin-profile {
    margin-top: 20px;
  }

  .main-content {
    width: 100%;
    padding: 24px 16px 40px;
  }

  .page-header h2 {
    font-size: 26px;
  }

  .page-header p {
    font-size: 15px;
  }

  .card-header h3 {
    font-size: 20px;
  }

  .logout-button {
    margin-top: 10px;
    height: 44px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .report-card {
    padding: 18px;
    border-radius: 18px;
  }

  .report-table {
    min-width: 980px;
  }

  .report-table th,
  .report-table td {
    padding: 14px 12px;
    font-size: 14px;
  }

  .property-info {
    gap: 10px;
  }

  .property-image {
    width: 72px;
    height: 56px;
  }

  .status-badge {
    min-width: 80px;
    font-size: 13px;
    padding: 7px 10px;
  }

  .action-buttons button {
    padding: 8px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 12px 32px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-header h2 {
    font-size: 22px;
  }

  .page-header p {
    font-size: 14px;
  }

  .report-card {
    padding: 14px;
  }

  .pagination {
    gap: 6px;
  }

  .pagination button {
    padding: 7px 10px;
    font-size: 13px;
  }
}
</style>
