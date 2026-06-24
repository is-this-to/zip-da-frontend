<script setup>
import { computed } from "vue";
import Header from "./components/Header.vue";
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "./store/auth/useAuthStore.js";

const route = useRoute();

const isAdminPage = computed(() => route.path.startsWith("/admin"));
const authStore = useAuthStore();
</script>

<template>
  <Header v-if="authStore.authInitialized && !isAdminPage" />
  <router-view></router-view>
  <Footer v-if="!isAdminPage"></Footer>
</template>
