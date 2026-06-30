import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const useRegionStore = defineStore("region", () => {
  // 지역데이터
  const provinces = ref([]);
  const cities = ref([]);
  const districts = ref([]);

  // 선택된 지역 값
  const selectedProvince = ref("");
  const selectedCity = ref("");
  const selectedDistrict = ref(null);

  // 시/도 조회
  const fetchProvinces = async () => {
    try {
      const response = await myAxios.get("/api/regions/provinces");
      provinces.value = response.data.data;
    } catch (error) {
      throw error;
    }
  };

  // 시/군/구 조회
  const fetchCities = async (province) => {
    try {
      if (!province) {
        cities.value = [];
        districts.value = [];

        selectedCity.value = "";
        selectedDistrict.value = null;
        return;
      }

      const response = await myAxios.get("/api/regions/cities", {
        params: {
          province,
        },
      });

      cities.value = response.data.data;

      selectedCity.value = "";
      selectedDistrict.value = null;

      districts.value = [];
    } catch (error) {
      throw error;
    }
  };

  // 읍면동 조회
  const fetchDistricts = async (province, city) => {
    try {
      if (!province || !city) {
        districts.value = [];
        selectedDistrict.value = null;
        return;
      }

      const response = await myAxios.get("/api/regions/districts", {
        params: {
          province,
          city,
        },
      });

      districts.value = response.data.data;
      selectedDistrict.value = null;
    } catch (error) {
      throw error;
    }
  };

  // 전체 초기화
  const resetRegion = () => {
    selectedProvince.value = "";
    selectedCity.value = "";
    selectedDistrict.value = null;

    cities.value = [];
    districts.value = [];
  };
  return {
    provinces,
    cities,
    districts,

    selectedProvince,
    selectedCity,
    selectedDistrict,

    fetchProvinces,
    fetchCities,
    fetchDistricts,

    resetRegion,
  };
});
