import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const useAdminReportStore = defineStore("adminReportStore", () => {
  // 1. State
  // -- 페이지네이션
  const currentPage = ref(0);
  const pageSize = ref(20);
  const total = ref(0);
  const lastPage = ref(false);
  // --
  const items = ref(null);
  const process = ref(null);

  // 2. Actions
  // 신고목록 조회
  const getReport = async (page = 1) => {
    try {
      // -- 페이지네이션
      const params = {
        page: page,
        pageSize: pageSize.value,
      };
      // --
      const url = `/api/admin/reports`;

      const response = await myAxios.get(url, { params });
      const data = response.data.data;

      items.value = data.dataList;
      // -- 페이지네이션
      total.value = data.total;
      currentPage.value = data.currentPage;
      lastPage.value = data.lastPage;
      // --
    } catch (error) {
      throw error;
    }
  };

  // 신고처리
  const setStatus = async (reportId, status, propertyId) => {
    try {
      console.log("2222"); //TODO
      const payload = {
        status: status,
        propertyId: propertyId,
      };
      const url = `/api/admin/reports/${reportId}`;

      const response = await myAxios.patch(url, payload);
      const resultCode = response.data.code;
      const resultData = response.data.data;

      // 처리 성공시 상태 변경
      if (resultCode == "00") {
        const targetItem = items.value.find(
          (r) => r.reportId === resultData.reportId,
        );
        console.log(targetItem); //TODO
        if (targetItem) {
          // targetItem.status = resultData.status;
          console.log(resultData.status); //TODO
          Object.assign(targetItem, { status: resultData.status });
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // 컴포넌트 이탈 시 상태 초기화 함수
  const clearReport = () => {
    items.value = null;
  };

  return {
    // -- 페이지네이션
    currentPage,
    pageSize,
    total,
    lastPage,
    // --
    items,
    process,
    getReport,
    setStatus,
    clearReport,
  };
});
