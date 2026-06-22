<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth/useAuthStore.js";

const router = useRouter();
const authStore = useAuthStore();

const goBookmarkList = () => {
  router.push("/mypage/bookmarks");
};
</script>

<template>
  <main class="mypage">
    <section class="mypage-header">
      <h1>마이페이지</h1>
      <p class="description">
        {{ authStore.userInfo?.name || authStore.userInfo?.nick || "회원" }}님의
        정보를 관리하는 공간입니다.
      </p>
    </section>

    <section class="menu-section" aria-label="마이페이지 메뉴">
      <button class="menu-card" type="button" @click="goBookmarkList">
        <span class="menu-icon">♡</span>
        <div>
          <h2>찜 목록</h2>
          <p>내가 찜한 매물을 한곳에서 확인합니다.</p>
        </div>
      </button>
      <button class="menu-card" type="button" @click="goBookmarkList">
        <span class="menu-icon">♡</span>
        <div>
          <h2>내 정보 수정</h2>
        </div>
      </button>
    </section>
  </main>
</template>

<style scoped>
.mypage {
  min-height: 800px;
  padding: 60px 100px;
  background: #f8f9fc;
  color: var(--personal-color-black);
}

.mypage-header {
  max-width: 960px;
  margin: 10px 20px;
}

.mypage-header h1 {
  margin: 0;
  font-size: 40px;
  font-weight: 900;
}

.description {
  margin: 14px 0 0;
  color: var(--personal-color-gray);
  font-size: 18px;
  font-weight: 600;
}

.menu-section {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 300px;
  padding: 25px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  background: var(--personal-color-white);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(21, 32, 48, 0.08);
  transition: 0.2s;
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 54px rgba(21, 32, 48, 0.14);
}

.menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: var(--personal-color-periwinkle);
  color: var(--personal-color-blue);
  font-size: 30px;
  font-weight: 900;
}

.menu-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 900;
}

.menu-card p {
  margin: 0;
  color: var(--personal-color-gray);
  font-size: 15px;
  font-weight: 600;
}
</style>
