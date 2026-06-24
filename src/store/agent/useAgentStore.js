import { defineStore } from "pinia";
import { computed, ref } from "vue";
import myAxios from "../../api/myAxios";
import { jwtDecode } from "jwt-decode";

export const useAgentStore = defineStore("agentStore", () => {
  // 1. State
  const 

  // 2. Getters

  // 3. Actions
  const applyAgent = async (applyForm) => {
    try {
      const url = "/api/agents";
    } catch (error) {
      
    }
  }
  return {
    // State
    // Getter
    // Actions
  };
});
