<script setup>
<<<<<<< HEAD
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
=======
import { computed, watch } from "vue";
import Header from "./components/Header.vue";
import { useRoute, useRouter } from "vue-router";
>>>>>>> dev
import Footer from "./components/Footer.vue";
import { useAuthStore } from "./store/auth/useAuthStore.js";
import { useMyErrorStore } from "./store/error/useMyErrorStore.js";

const route = useRoute();
<<<<<<< HEAD
const authStore = useAuthStore();

const isAdminPage = computed(() => route.path.startsWith("/admin"));
</script>

<template>
  <Header v-if="authStore.authInitialized && !isAdminPage" />
  <router-view></router-view>
  <Footer v-if="authStore.authInitialized && !isAdminPage" />
=======
const router = useRouter();

const isAdminPage = computed(() => route.path.startsWith("/admins"));
const isErrorPage = computed(() => route.path.startsWith("/errors"));
const authStore = useAuthStore();
const myErrorStore = useMyErrorStore();

watch(
  // myErrorStore.isError 변경 되는거 지켜보기
  () => myErrorStore.isError,
  // 변경된 isError값을 파라미터로 함수 실행
  (isError) => {
    if (isError && route.path !== "/errors") {
      router.replace("/errors");
    }
  },
  { immediate: true },
);
</script>

<template>
  <Header v-if="!isAdminPage && !isErrorPage" />
  <router-view></router-view>
  <Footer v-if="!isAdminPage && !isErrorPage"></Footer>
>>>>>>> dev
</template>
