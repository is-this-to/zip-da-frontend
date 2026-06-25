import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import Main from "../views/main/Main.vue";
import SignIn from "../views/auth/SignIn.vue";
import SignUp from "../views/auth/SignUp.vue";
import AdminSignIn from "../views/auth/AdminSignIn.vue";
import Admin from "../views/admin/Admin.vue";
import { USER_ROLE } from "../constants/user/role.js";
import PropertySearch from "../views/property/PropertySearch.vue";
import PropertyShow from "../views/property/PropertyShow.vue";
import AgentApply from "../views/agent/AgentApply.vue";
import AgentPage from "../views/agent/AgentPage.vue";

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
    path: "/admins",
    component: Admin,
    meta: setMeta(true, false, [USER_ROLE.ADMIN]),
  },
  {
    path: "/admins/sign-in",
    component: AdminSignIn,
    meta: setMeta(false, false),
  },
  {
    path: "/agents",
    component: AgentPage,
    meta: setMeta(false, false, [USER_ROLE.AGENT]),
  },
  {
    path: "/agents/apply",
    component: AgentApply,
    meta: setMeta(true, false, [USER_ROLE.USER]),
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

  if (!authStore.authInitialized) {
    try {
      await authStore.reissue();
    } catch {
      throw error;
    }
  }

  let role = authStore.role;

  // 로그인, 회원가입처럼 "비회원만" 들어갈 수 있는 페이지를 들어갈때
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next("/");
  }

  // admin 권한이 필요한 페이지로 가는데 role이 admin이 아닌경우
  if (to.meta.roles.includes(USER_ROLE.ADMIN) && role != USER_ROLE.ADMIN) {
    return next("/admins/sign-in");
  }

  // 로그인이 필요한 페이지인데 로그인 안 한 경우
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next("/sign-in");
  }

  // 중개사 권한이 필요한데 중개사 권한이 없는 경우
  if (to.meta.roles.includes(USER_ROLE.AGENT) && role != USER_ROLE.AGENT) {
    // 로그인 자체를 안 한 사용자 -> 회원가입 화면으로 이동
    if (authStore.role === null) {
      return next("/sign-in");
    }
    // Agent 권한이 없는 사용자가 접근 -> 중개사 인증 페이지로 이동
    if (authStore.role === USER_ROLE.USER) {
      return next("/agents/apply");
    }
  }

  //특정 권한이 필요한데 없는 경우 메인페이지로 이동
  if (to.meta.roles.length > 0 && !to.meta.roles.includes(role)) {
    return next("/");
  }

  // 나머지는 통과
  next();
});

export default router;
