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
  const resetAgentStore = () => {
    approvedStatus.value = "";
    licenseNo.value = "";
    businessNo.value = "";
    officeName.value = "";
    agentImageUrl.value = "";
  };

  const applyAgent = async (applyForm) => {
    try {
      const url = "/api/agents";
      const res = await myAxios.post(url, applyForm);
      licenseNo.value = applyForm.licenseNo;
      businessNo.value = applyForm.businessNo;
      officeName.value = applyForm.officeName;
      agentImageUrl.value = applyForm.agentImageUrl;

      approvedStatus.value = res.data.data.approvedStatus;
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
      approvedStatus.value = res.data.data.approvedStatus;
      agentImageUrl.value = res.data.data.agentImageUrl;
    } catch (error) {
      if (error.response?.status === 404) {
        resetAgentStore();
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
    resetAgentStore,
  };
});
