import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const usePropertyShowStore = defineStore("propertyShowStore", () => {
  // 1. State
  const property = ref(null);

  // 2. Actions
  const getProperty = async (id) => {
    try {
      const url = `/api/properties/${id}`;
      const result = await myAxios.get(url);

      property.value = result.data.data;
    } catch (error) {
      // console.error("매물 상세 정보를 불러오는데 실패했습니다.", error);
      // alert("매물 정보를 불러올 수 없습니다.");
      throw error; //TODO:에러처리
    } finally {
      //TODO
    }
  };

  // 컴포넌트 이탈 시 상태 초기화 함수
  const clearPropertyShow = () => {
    property.value = null;
  };

  return {
    property,
    getProperty,
    clearPropertyShow,
  };
});
