import { defineStore } from "pinia";
import { computed, ref } from "vue";
import myAxios from "../../api/myAxios";
import { jwtDecode } from "jwt-decode";

export const useAgentStore = defineStore("agentStore", () => {
  // 1. State

  // 2. Getters

  // 3. Actions
  const applyAgent = async (applyForm) => {
    try {
      const url = "/api/agents";
      const res = await myAxios.post(url, applyForm);
      return res.data;
    } catch (error) {
      throw error;
    }
  };
  return {
    // State
    // Getter
    // Actions
    applyAgent,
  };
});
