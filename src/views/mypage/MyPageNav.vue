<script setup>
const menuList = [
  {
    to: "/mypage/profile",
    icon: "👤",
    label: "내 정보 수정",
  },
  {
    to: "/mypage/bookmarks",
    icon: "♡",
    label: "찜 목록",
  },
  {
    to: "/mypage/posts",
    icon: "⌂",
    label: "내가 올린 게시물",
  },
  {
    to: "/mypage/reports",
    icon: "ⓘ",
    label: "신고 내역",
  },
];
</script>

<template>
  <nav class="mypage-nav" aria-label="마이페이지 메뉴">
    <RouterLink
      v-for="menu in menuList"
      :key="menu.to"
      :to="menu.to"
      class="nav-item"
      active-class="active"
    >
      <span>{{ menu.icon }}</span>
      <strong>{{ menu.label }}</strong>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mypage-nav {
  display: grid;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 13px;
  border-radius: 8px;
  color: #596375;
  text-decoration: none;
  font-size: 13px;
}

.nav-item:hover {
  background: #eef3ff;
}

.nav-item.active {
  color: #fff;
  background: #0064ff;
}

.nav-item span {
  width: 18px;
  text-align: center;
}
</style>
