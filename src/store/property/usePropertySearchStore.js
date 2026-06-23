import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const usePropertySearchStore = defineStore("propertySearch", () => {
  const items = ref([]);
  const currentPage = ref(0);
  const pageSize = ref(20);

  const total = ref(0);
  const lastPage = ref(false);

  const searchPropertyPagination = async (page = 1) => {
    try {
      const url = "/api/properties";
      const params = {
        page: page,
        pageSize: pageSize.value,
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

  return {
    items,
    currentPage,
    pageSize,
    total,
    lastPage,
    searchPropertyPagination,
  };
});
