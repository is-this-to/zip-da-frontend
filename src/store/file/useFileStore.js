import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import myAxios from "../../api/myAxios";

export const useFileStore = defineStore("fileStore", () => {
  // 1. State

  // 2. Getter

  // 3. Actions
  const storeAgentProfile = async (file) => {
    try {
      const url = "/api/agent-images";
      // formdata 생성
      const data = new FormData();
      data.append("file", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await myAxios.post(url, data, config);
      return res.data.data.fileUri;
    } catch (error) {
      throw error;
    }
  };

  return {
    // 1. State

    // 2. Getter

    // 3. Actions
    storeAgentProfile,
  };
});
