import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios"; // 본인 프로젝트 경로에 맞게 확인해주세요!

export const usePropertySearchStore = defineStore("propertySearch", () => {
  const items = ref([]);
  const currentPage = ref(0);
  const pageSize = ref(20);

  const total = ref(0);
  const lastPage = ref(false);

  // 1. keyword 필드가 추가된 검색 필터 객체
  const searchFilters = ref({
    keyword: "", // 지역/단지명 검색용
    propertyType: null,
    transactionType: null,
    status: null,
    regionId: null,
    minPrice: null,
    maxPrice: null,
    minDeposit: null,
    maxDeposit: null,
    minMonthlyRent: null,
    maxMonthlyRent: null,
  });

  const searchPropertyPagination = async (page = 1) => {
    try {
      const url = "/api/properties";
      const params = {
        page: page,
        pageSize: pageSize.value,
        ...searchFilters.value,
      };

      const response = await myAxios.get(url, { params });
      const data = response.data.data;

      items.value = data.properties;
      total.value = data.total;
      currentPage.value = data.currentPage;
      lastPage.value = data.lastPage;
    } catch (error) {
      console.error(error);
    }
  };

  // 2. 대망의 필터 초기화 함수! (여기서 싹 비우고 1페이지 다시 검색)
  const resetFilters = () => {
    searchFilters.value = {
      keyword: "",
      propertyType: null,
      transactionType: null,
      status: null,
      regionId: null,
      minPrice: null,
      maxPrice: null,
      minDeposit: null,
      maxDeposit: null,
      minMonthlyRent: null,
      maxMonthlyRent: null,
    };
    searchPropertyPagination(1);
  };

  return {
    items,
    currentPage,
    pageSize,
    total,
    lastPage,
    searchFilters,
    searchPropertyPagination,
    resetFilters, // 3. 꼭 return에 넣어줘야 컴포넌트에서 쓸 수 있습니다!
  };
});
