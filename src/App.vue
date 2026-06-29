<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "./store/auth/useAuthStore.js";

const route = useRoute();
const authStore = useAuthStore();

const isAdminPage = computed(() => route.path.startsWith("/admin"));
</script>

<template>
  <Header v-if="authStore.authInitialized && !isAdminPage" />
  <router-view></router-view>
  <Footer v-if="authStore.authInitialized && !isAdminPage" />
</template>
