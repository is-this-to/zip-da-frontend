import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";
import agentApprovedStatus from "../../constants/agentApprovedStatus";

export const useAgentStore = defineStore("agentStore", () => {
  // 1. State
  const licenseNo = ref("");
  const businessNo = ref("");
  const officeName = ref("");
  const approvedStatus = ref("");
  const agentImageUrl = ref("");

  // 2. Getters

  // 3. Actions
  const applyAgent = async (applyForm) => {
    try {
      const url = "/api/agents";
      const res = await myAxios.post(url, applyForm);
      approvedStatus.value = agentApprovedStatus.agentApprovedStatus.PENDING;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const checkAgentInfo = async () => {
    try {
      const url = "/api/agents/me";
      const res = await myAxios.get(url);

      licenseNo.value = res.data.data.licenseNo;
      businessNo.value = res.data.data.businessNo;
      officeName.value = res.data.data.officeName;
      approvedStatus.value = res.data.data.agentApprovedStatus;
      agentImageUrl.value = res.data.data.agentImageUrl;
    } catch (error) {
      if (error.response?.status === 404) {
        return;
      }
      throw error;
    }
  };

  return {
    // State
    licenseNo,
    businessNo,
    officeName,
    approvedStatus,
    agentImageUrl,
    // Getter
    // Actions
    applyAgent,
    checkAgentInfo,
  };
});
