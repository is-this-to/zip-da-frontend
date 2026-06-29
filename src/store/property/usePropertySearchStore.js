import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const usePropertySearchStore = defineStore("propertySearch", () => {
  const items = ref([]);
  const currentPage = ref(0);
  const pageSize = ref(20);

  const total = ref(0);
  const lastPage = ref(false);

  // 1. keyword 필드가 추가된 검색 필터 객체
  const searchFilters = ref({
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
      };

      // 데이터 클렌징 로직
      // Object.entries() : 객체를 배열(이차원 배열: key, value)로 바꿔주는 메서드
      Object.entries(searchFilters.value).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params[key] = value;
        }
      });

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

  // 필터 초기화
  const resetFilters = () => {
    searchFilters.value = {
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
    searchPropertyPagination();
  };

  return {
    items,
    currentPage,
    pageSize,
    total,
    lastPage,
    searchFilters,
    searchPropertyPagination,
    resetFilters,
  };
});
