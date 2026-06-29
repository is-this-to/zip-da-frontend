import { ref } from "vue";
import { usePropertySearchStore } from "../store/property/usePropertySearchStore";

export function usePriceFilter() {
  const store = usePropertySearchStore();
  const isAdvancedOpen = ref(false);

  // 화면 입력용 임시 가격 (만원 단위)
  const localPrices = ref({
    minPrice: null,
    maxPrice: null,
    minDeposit: null,
    maxDeposit: null,
    minMonthlyRent: null,
    maxMonthlyRent: null,
  });

  // 상세 창 토글 및 스토어 값 불러오기 (만원 단위로 변환)
  const toggleAdvancedFilter = () => {
    isAdvancedOpen.value = !isAdvancedOpen.value;
    if (isAdvancedOpen.value) {
      const filters = store.searchFilters;
      localPrices.value.minPrice = filters.minPrice
        ? filters.minPrice / 10000
        : null;
      localPrices.value.maxPrice = filters.maxPrice
        ? filters.maxPrice / 10000
        : null;
      localPrices.value.minDeposit = filters.minDeposit
        ? filters.minDeposit / 10000
        : null;
      localPrices.value.maxDeposit = filters.maxDeposit
        ? filters.maxDeposit / 10000
        : null;
      localPrices.value.minMonthlyRent = filters.minMonthlyRent
        ? filters.minMonthlyRent / 10000
        : null;
      localPrices.value.maxMonthlyRent = filters.maxMonthlyRent
        ? filters.maxMonthlyRent / 10000
        : null;
    }
  };

  // 적용하기 (10000 곱해서 스토어에 전송 후 검색)
  const applyPrices = () => {
    store.searchFilters.minPrice = localPrices.value.minPrice
      ? localPrices.value.minPrice * 10000
      : null;
    store.searchFilters.maxPrice = localPrices.value.maxPrice
      ? localPrices.value.maxPrice * 10000
      : null;
    store.searchFilters.minDeposit = localPrices.value.minDeposit
      ? localPrices.value.minDeposit * 10000
      : null;
    store.searchFilters.maxDeposit = localPrices.value.maxDeposit
      ? localPrices.value.maxDeposit * 10000
      : null;
    store.searchFilters.minMonthlyRent = localPrices.value.minMonthlyRent
      ? localPrices.value.minMonthlyRent * 10000
      : null;
    store.searchFilters.maxMonthlyRent = localPrices.value.maxMonthlyRent
      ? localPrices.value.maxMonthlyRent * 10000
      : null;

    store.searchPropertyPagination(1);
  };

  // 로컬 가격 데이터만 초기화
  const resetLocalPrices = () => {
    localPrices.value = {
      minPrice: null,
      maxPrice: null,
      minDeposit: null,
      maxDeposit: null,
      minMonthlyRent: null,
      maxMonthlyRent: null,
    };
    isAdvancedOpen.value = false;
  };

  return {
    localPrices,
    isAdvancedOpen,
    toggleAdvancedFilter,
    applyPrices,
    resetLocalPrices,
  };
}
