import { defineStore } from "pinia";
import { computed, ref } from "vue";
import myAxios from "../../api/myAxios";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("authStore", () => {
  // 1. State
  const isLoggedIn = ref(false);
  const accessToken = ref("");
  const userInfo = ref(null);
  const authInitialized = ref(false);
  const adminAuthInitialized = ref(false);

  // 2. Getters
  const role = computed(() => {
    if (!accessToken.value) {
      return null;
    }
    try {
      return jwtDecode(accessToken.value).role;
    } catch (error) {
      return null;
    }
  });

  // 3. Actions
  const clearAuthStore = () => {
    isLoggedIn.value = false;
    accessToken.value = "";
    userInfo.value = null;
  };

  const login = async (loginForm) => {
    try {
      const url = "/api/auth/sessions";
      const res = await myAxios.post(url, loginForm);

      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.principal;
      isLoggedIn.value = true;
    } catch (error) {
      throw error;
    }
  };

  const reissue = async () => {
    try {
      const url = "/api/auth/tokens";
      const res = await myAxios.post(url);

      const data = res.data.data;
      accessToken.value = data.accessToken;
      userInfo.value = data.principal;
      isLoggedIn.value = true;

      return true;
    } catch (error) {
      clearAuthStore();

      return false;
    } finally {
      authInitialized.value = true;
    }
  };

  const logout = async () => {
    try {
      const url = "/api/auth/sessions";
      await myAxios.delete(url);
    } catch (error) {
      throw error;
    } finally {
      clearAuthStore();
    }
  };

  const registration = async (newUserData) => {
    try {
      const url = "/api/users";
      const res = await myAxios.post(url, newUserData);
    } catch (error) {
      throw error;
    }
  };

  const adminLogin = async (adminLoginForm) => {
    try {
      const url = "/api/admin/auth/sessions";
      const res = await myAxios.post(url, adminLoginForm);

      accessToken.value = res.data.data.accessToken;
      userInfo.value = res.data.data.principal;
      isLoggedIn.value = true;
    } catch (error) {
      throw error;
    }
  };

  const adminLogout = async () => {
    try {
      const url = "/api/admin/auth/sessions";
      const res = await myAxios.delete(url);
    } catch (error) {
      throw error;
    } finally {
      clearAuthStore();
    }
  };

  const adminReissue = async () => {
    try {
      const url = "/api/admin/auth/tokens";
      const res = await myAxios.post(url);
      accessToken.value = res.data.data.accessToken;
      userInfo.value = res.data.data.principal;
      isLoggedIn.value = true;
    } catch (error) {
      clearAuthStore();
    } finally {
      adminAuthInitialized.value = true;
    }
  };

  return {
    // State
    isLoggedIn,
    accessToken,
    userInfo,
    authInitialized,
    adminAuthInitialized,

    // Getter
    role,

    // Actions
    clearAuthStore,
    login,
    reissue,
    logout,
    registration,
    adminLogin,
<<<<<<< HEAD
    adminLogout,
=======
    adminReissue,
>>>>>>> dev
  };
});
