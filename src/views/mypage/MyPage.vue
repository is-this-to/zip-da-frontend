<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../store/auth/useAuthStore.js";
import MyPageNav from "./MyPageNav.vue";

const authStore = useAuthStore();

const displayName = computed(() => {
  return authStore.userInfo?.nick || authStore.userInfo?.name || "회원";
});

const roleLabel = computed(() => {
  return authStore.role === "AGENT" ? "공인중개사" : "일반회원";
});
</script>

<template>
  <main class="mypage-shell">
    <aside class="mypage-sidebar">
      <RouterLink to="/main" class="logo">Zip-da</RouterLink>

      <div class="member-mini-card">
        <div class="avatar">{{ displayName.slice(0, 1) }}</div>
        <div>
          <strong>{{ displayName }}</strong>
          <span>{{ roleLabel }}</span>
        </div>
      </div>

      <MyPageNav />
    </aside>

    <section class="mypage-content">
      <!-- /mypage/profile, /mypage/bookmarks 같은 하위 페이지가 이 자리에 표시됩니다. -->
      <RouterView />
    </section>
  </main>
</template>

<style scoped>
.mypage-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: calc(100vh - 70px);
  background: #f7f8fd;
}

.mypage-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 28px 24px;
  border-right: 1px solid #e6eaf2;
  background: #fbfbff;
}

.logo {
  display: inline-block;
  margin-bottom: 34px;
  color: #0064ff;
  font-size: 27px;
  font-weight: 900;
  text-decoration: none;
}

.member-mini-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #0064ff;
  background: #dbe9ff;
  font-weight: 900;
}

.member-mini-card strong,
.member-mini-card span {
  display: block;
}

.member-mini-card strong {
  color: #243149;
  font-size: 14px;
}

.member-mini-card span {
  margin-top: 3px;
  color: #8b94a4;
  font-size: 12px;
}

.mypage-content {
  width: min(100%, 980px);
  padding: 54px 56px 90px;
}

@media (max-width: 860px) {
  .mypage-shell {
    grid-template-columns: 1fr;
  }

  .mypage-sidebar {
    position: static;
    height: auto;
  }

  .mypage-content {
    padding: 32px 18px 70px;
  }
}
</style>
