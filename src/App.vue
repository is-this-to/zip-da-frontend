<script setup>
import Header from "./components/Header.vue";
import { useAuthStore } from "./store/auth/useAuthStore.js";

const authStore = useAuthStore();
</script>

<template>
  <Header v-if="authStore.authInitialized" />
  <router-view></router-view>
</template>
