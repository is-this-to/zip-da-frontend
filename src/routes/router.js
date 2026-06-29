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
import { useAgentStore } from "../store/agent/useAgentStore.js";
import agentApprovedStatus from "../constants/agentApprovedStatus.js";
import PropertyCreate from "../views/property/PropertyCreate.vue";
import PropertyEdit from "../views/property/PropertyEdit.vue";
import PropertyDetail from "../views/property/PropertyDetail.vue";
import ErrorPage from "../views/error/ErrorPage.vue";

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
    component: PropertyDetail,
    meta: setMeta(false, false),
  },
  // ============ 매물 도메인 (담당: 임호탁 / feature/property_LHT) ============
  {
    path: "/properties/create",
    component: PropertyCreate,
    meta: setMeta(false, false), // TODO: 한지윤 인증 머지 완료 후 setMeta(true, false, [USER_ROLE.USER, USER_ROLE.AGENT, USER_ROLE.ADMIN])
  },
  {
    path: "/properties/:propertyId/edit",
    component: PropertyEdit,
    meta: setMeta(false, false), // TODO: 한지윤 인증 머지 완료 후 setMeta(true, false, [USER_ROLE.USER, USER_ROLE.AGENT, USER_ROLE.ADMIN])
  },
  // ============================================================
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
  {
    path: "/errors",
    component: ErrorPage,
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
  const agentStore = useAgentStore();

  if (!authStore.authInitialized) {
    try {
      await authStore.reissue();
    } catch {
      // 토큰 재발급 실패: 게스트 상태로 진행
    }
  }

  // 로그인, 회원가입처럼 "비회원만" 들어갈 수 있는 페이지를 들어갈때
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next("/");
  }

  // admin 권한이 필요한 페이지로 가는데 role이 admin이 아닌경우
  if (to.meta.roles.includes(USER_ROLE.ADMIN)) {
    if (!authStore.adminAuthInitialized) {
      await authStore.adminReissue();
    }

    if (authStore.role !== USER_ROLE.ADMIN) {
      return next("/admins/sign-in");
    }
  }

  // 로그인이 필요한 페이지인데 로그인 안 한 경우
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next("/sign-in");
  }

  // 중개사 권한이 필요한데 중개사 권한이 없는 경우
  if (
    to.meta.roles.includes(USER_ROLE.AGENT) &&
    authStore.role != USER_ROLE.AGENT
  ) {
    // 로그인 자체를 안 한 사용자 -> 회원가입 화면으로 이동
    if (authStore.role === null) {
      return next("/sign-in");
    }

    if (
      useAgentStore.approvedStatus ===
      agentApprovedStatus.agentApprovedStatus.PENDING
    ) {
      try {
        await agentStore.checkAgentInfo();
      } catch (error) {
        throw error;
      }
    }

    // Agent 권한이 없는 사용자가 접근 -> 중개사 인증 페이지로 이동
    if (authStore.role === USER_ROLE.USER) {
      return next("/agents/apply");
    }
  }

  // 이미 신청해서 PENDING or APPROVED 상태일때 중개사 인증 페이지로 이동불가
  if (
    to.path === "/agents/apply" &&
    agentStore.approvedStatus !==
      agentApprovedStatus.agentApprovedStatus.REJECTED
  ) {
    if (
      agentStore.approvedStatus ===
      agentApprovedStatus.agentApprovedStatus.PENDING
    ) {
      alert("이미 중개사 인증 신청이 접수되어 관리자 심사 중입니다.");
    }
    if (
      agentStore.approvedStatus ===
      agentApprovedStatus.agentApprovedStatus.APPROVED
    ) {
      alert("현재 이미 공인중개사 권한이 있습니다");
      return "/";
    }
  }

  if (to.meta.roles.length > 0 && !to.meta.roles.includes(authStore.role)) {
    //특정 권한이 필요한데 없는 경우 메인페이지로 이동
    alert("권한이 없습니다.");
    return next("/");
  }

  // 나머지는 통과
  next();
});

export default router;
