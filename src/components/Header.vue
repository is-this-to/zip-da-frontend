<script setup>
import { ref } from "vue";
import MyButton from "./button/MyButton.vue";

// 로그인 구현후 변경바람
//---------------------------
 // const isLoggedIn = ref(false);
//---------------------------

//---장수린-------
const isLoggedIn = true;
//---------------


</script>

<template>
  <div class="header">
    <div class="title-box">
      <div class="title-logo"></div>
      <div class="title">Zip-da</div>
    </div>
    <div class="btn-box">
      <MyButton
        v-if="!isLoggedIn"
        class="btn-login"
        :content="'Sign In'"
        :color="'white'"
        :size="'small'"
      />
      <MyButton
        v-if="!isLoggedIn"
        class="btn-signUp"
        :content="'Sign Up'"
        :color="'blue'"
        :size="'small'"
      />
      <MyButton
        v-if="isLoggedIn"
        class="btn-myPage"
        :content="'User'"
        :color="'white'"
        :size="'small'"
      />
    </div>
  </div>
</template>

<style scoped>
/* header */
.header {
  padding: 10px;
  background-color: var(--personal-color-periwinkle);
  display: flex;
  justify-content: space-between;
}
/* title-box */
.title-box {
  display: flex;
  gap: 10px;
}
/* btn-box */
.btn-box {
  display: flex;
  gap: 10px;
}
.btn-login {
  border: none;
  border-radius: 20px;
}
.btn-signUp {
  border: none;
  border-radius: 20px;
}
.btn-myPage {
  border: none;
  border-radius: 10px;
}
</style>
