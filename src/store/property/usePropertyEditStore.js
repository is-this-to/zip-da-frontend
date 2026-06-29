import { defineStore } from "pinia";
import { ref } from "vue";
import { getPropertyDetail, updateProperty } from "../../api/propertyApi";

export const usePropertyEditStore = defineStore("propertyEdit", () => {
  const isLoading = ref(false);
  const isSubmitting = ref(false);

  const fetchProperty = async (propertyId) => {
    isLoading.value = true;
    try {
      return await getPropertyDetail(propertyId);
    } finally {
      isLoading.value = false;
    }
  };

  const submitUpdate = async (propertyId, form) => {
    isSubmitting.value = true;
    try {
      return await updateProperty(propertyId, form);
    } finally {
      isSubmitting.value = false;
    }
  };

  return { isLoading, isSubmitting, fetchProperty, submitUpdate };
});
