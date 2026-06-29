import { defineStore } from "pinia";
import { ref } from "vue";
import { createProperty } from "../../api/propertyApi";

export const usePropertyCreateStore = defineStore("propertyCreate", () => {
  const isSubmitting = ref(false);

  const submitCreate = async (form) => {
    isSubmitting.value = true;
    try {
      return await createProperty(form);
    } finally {
      isSubmitting.value = false;
    }
  };

  return { isSubmitting, submitCreate };
});
