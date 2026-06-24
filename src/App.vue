<script setup>
import { computed } from "vue";
import Header from "./components/Header.vue";
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";

const route = useRoute();

const isAdminPage = computed(() => route.path.startsWith("/admin"));
</script>

<template>
  <Header v-if="!isAdminPage" />
  <router-view></router-view>
  <Footer v-if="!isAdminPage"></Footer>
</template>
