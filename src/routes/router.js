import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import Main from "../views/main/Main.vue";
import SignIn from "../views/auth/SignIn.vue";
import SignUp from "../views/auth/SignUp.vue";

import MyPage from "../views/mypage/MyPage.vue";
import MyProfile from "../views/mypage/MyProfile.vue";
import MyBookmarkList from "../views/mypage/MyBookmarkList.vue";
import MyPostList from "../views/mypage/MyPostList.vue";
import MyReportList from "../views/mypage/MyReportList.vue";

import Admin from "../views/admin/Admin.vue";
import { USER_ROLE } from "../constants/role.js";

import PropertySearch from "../views/property/PropertySearch.vue";
import PropertyShow from "../views/property/PropertyShow.vue";

// 팀원 각자파트 권한을 나눠서 routes 컴포넌트 경로 적어주세요
const setMeta = (requiresAuth, guestOnly, roles = []) => {
  return {
    requiresAuth, // 로그인이 필요?
    guestOnly, // 게스트만 접근 가능?
    roles, // 해당 role을 가진 유저만 접근 가능, []인 경우 role 필요 없음
  };
};

const routes = [
  {
    path: "/",
    redirect: "/main",
    meta: setMeta(false, false),
  },
  {
    path: "/main",
    component: Main,
    meta: setMeta(false, false),
  },
  {
    path: "/properties",
    component: PropertySearch,
    meta: setMeta(false, false),
  },
  {
    path: "/properties/:propertyId",
    component: PropertyShow,
    meta: setMeta(false, false),
  },
  {
    path: "/sign-in",
    component: SignIn,
    meta: setMeta(false, true),
  },
  {
    path: "/sign-up",
    component: SignUp,
    meta: setMeta(false, true),
  },
  {
    path: "/mypage",
    component: MyPage,
    meta: setMeta(true, false),
    children: [
      {
        path: "",
        redirect: "/mypage/profile",
      },
      {
        path: "profile",
        component: MyProfile,
        meta: setMeta(true, false),
      },
      {
        path: "bookmarks",
        component: MyBookmarkList,
        meta: setMeta(true, false),
      },
      {
        path: "posts",
        component: MyPostList,
        meta: setMeta(true, false),
      },
      {
        path: "reports",
        component: MyReportList,
        meta: setMeta(true, false),
      },
    ],
  },
  {
    path: "/properties",
    component: PropertySearch,
    meta: setMeta(false, false),
  },
  {
    path: "/properties/new",
    redirect: "/properties",
    meta: setMeta(true, false),
  },
  {
    path: "/properties/:id",
    component: PropertyShow,
    meta: setMeta(false, false),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router 이동 전 실행되는 메서드
// to: 이동하는 router, from: 지금 있는 router
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  let role = authStore.role;

  if (!authStore.authInitialized) {
    try {
      await authStore.reissue();
    } catch (error) {
      throw error;
    }
  }

  // 1. guestOnly 페이지
  // 로그인, 회원가입처럼 "비회원만" 들어갈 수 있는 페이지
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next("/");
  }

  // 2. 로그인이 필요한 페이지인데 로그인 안 한 경우
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next("/sign-in");
  }

  // 3. 중개사 권한이 필요한데 중개사 권한이 없는 경우
  if (to.meta.roles.includes(USER_ROLE.AGENT) && role != USER_ROLE.AGENT) {
    // -------- 공인중개사 인증 페이지로 이동 -> 나중에 추가 예정
  }

  // 4. 특정 권한이 필요한데 없는 경우 메인페이지로 이동
  if (to.meta.roles.length > 0 && !to.meta.roles.includes(role)) {
    return next("/");
  }

  // 나머지는 통과
  next();
});

export default router;
