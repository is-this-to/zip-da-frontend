<script setup>
import { ref } from "vue";
import MyButton from "./button/MyButton.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import { storeToRefs } from "pinia";
import { useMyErrorStore } from "../store/error/useMyErrorStore.js";

const router = useRouter();
const authStore = useAuthStore();
const errorStore = useMyErrorStore();

const guestNavItems = [
  {
    content: "매물 조회",
    // 후에 router push할때 사용
    path: "/properties",
  },
  {
    content: "공인중개사 페이지",
    path: "/agents",
  },
];

const userNavItems = [
  {
    content: "매물 조회",
    // 후에 router push할때 사용
    path: "/properties",
  },
  {
    content: "매물 등록",
    path: "/properties/create",
  },
  {
    content: "공인중개사 페이지",
    path: "/agents",
  },
];

const redirectLogin = () => {
  router.push("/sign-in");
};
const redirectMain = () => {
  router.push("/main");
};

const { isLoggedIn } = storeToRefs(authStore);

const redirectMyPage = () => {
  router.push("/mypage");
};
</script>

<template>
  <div class="header">
    <div class="title-box" @click="redirectMain">
      <div class="title-logo"></div>
      <div class="title">ZIPDA</div>
    </div>
    <div class="nav-bar">
      <RouterLink
        v-for="item in guestNavItems"
        :key="item.content"
        class="nav-item"
        :to="item.path"
        v-if="!isLoggedIn"
        >{{ item.content }}
      </RouterLink>
      <RouterLink
        v-for="item in userNavItems"
        :key="item.content"
        class="nav-item"
        :to="item.path"
        v-if="isLoggedIn"
        >{{ item.content }}
      </RouterLink>
    </div>
    <div class="btn-box">
      <MyButton
        v-if="!isLoggedIn"
        class="btn-login"
        :content="'로그인'"
        :color="'white'"
        :size="'small'"
        @click="redirectLogin"
      />
      <MyButton
        v-if="isLoggedIn"
        class="btn-myPage"
        :content="'마이페이지'"
        :color="'white'"
        :size="'small'"
        @click="redirectMyPage"
      />
    </div>
  </div>
</template>

<style scoped>
/* header */
.header {
  padding: 10px 5%;
  background-color: var(--personal-color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
/* title-box */
.title-box {
  display: flex;
  display: flex;
  align-items: center;
  cursor: pointer;
}
/* btn-box */
.btn-box {
  display: flex;
  gap: 10px;
}
.btn-login,
.btn-myPage {
  border: none;
  font-weight: 600;
  color: var(--personal-color-blue);
}

.btn-login:hover,
.btn-myPage:hover {
  transition: 0.3s;
  color: var(--personal-color-black);
}

/* 네비게이션 바 */
.nav-bar {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10%;
}

.nav-item {
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  color: var(--personal-color-black);
  text-decoration: none;
}
.nav-item:hover {
  color: var(--personal-color-blue);
  transition: 0.3s;
}

@media (max-width: 700px) {
  .title,
  .title-box {
    display: none;
  }
}
</style>
