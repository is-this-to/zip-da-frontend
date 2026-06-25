import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const useAdminReportStore = defineStore("adminReportStore", () => {
  // 1. State
  // 페이지네이션
  const currentPage = ref(0);
  const pageSize = ref(20);
  const total = ref(0);
  const lastPage = ref(false);

  const items = ref(null);

  // 2. Actions
  const getReport = async (page = 1) => {
    try {
      // 페이지네이션
      const params = {
        page: page,
        pageSize: pageSize.value,
      };

      const url = `/api/admin/reports`;

      const result = await myAxios.get(url, { params });
      const data = response.data.data;

      items.value = data.dataList;
      // 페이지네이션
      total.value = data.total;
      currentPage.value = data.currentPage;
      lastPage.value = data.lastPage;
    } catch (error) {
      throw error;
    }
  };

  // 컴포넌트 이탈 시 상태 초기화 함수
  const clearReport = () => {
    items.value = null;
  };

  return {
    // 페이지네이션
    currentPage,
    pageSize,
    total,
    lastPage,

    items,
    getReport,
    clearReport,
  };
});
