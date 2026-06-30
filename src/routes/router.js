import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth/useAuthStore.js";
import { useAdminAuthStore } from "../store/auth/useAdminAuthStore.js";
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
import { AGENT_APPROVED_STATUS } from "../constants/agentApprovedStatus.js";
import AdminReportManage from "../views/admin/AdminReportManage.vue";
import PropertyCreate from "../views/property/PropertyCreate.vue";
import PropertyEdit from "../views/property/PropertyEdit.vue";
import PropertyDetail from "../views/property/PropertyDetail.vue";
import ErrorPage from "../views/error/ErrorPage.vue";

// ============ 마이페이지 추가 ============
import MyPage from "../views/mypage/MyPage.vue";
import MyProfile from "../views/mypage/MyProfile.vue";
import MyBookmarkList from "../views/mypage/MyBookmarkList.vue";
import MyPostList from "../views/mypage/MyPostList.vue";
import MyReportList from "../views/mypage/MyReportList.vue";
// ======================================

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
  {
    path: "/properties/create",
    component: PropertyCreate,
    meta: setMeta(true, false, [USER_ROLE.USER, USER_ROLE.AGENT]),
  },
  {
    path: "/properties/:propertyId/edit",
    component: PropertyEdit,
    meta: setMeta(true, false, [USER_ROLE.USER, USER_ROLE.AGENT]),
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
    component: AdminReportManage,
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
    meta: setMeta(true, false, [USER_ROLE.AGENT]),
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
  // ============ 마이페이지 (담당: 장수린 / feature/mypage_JSL) ============
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router 이동 전 실행되는 메서드
// to: 이동하는 router, from: 지금 있는 router
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const adminAuthStore = useAdminAuthStore();
  const agentStore = useAgentStore();

  const isAdminRoute =
    to.path === "/admins/sign-in" || to.meta.roles.includes(USER_ROLE.ADMIN);

  if (isAdminRoute) {
    if (!adminAuthStore.authInitialized) {
      await adminAuthStore.reissue();
    }

    if (to.path === "/admins/sign-in") {
      return adminAuthStore.isLoggedIn ? next("/admins") : next();
    }

    if (adminAuthStore.role !== USER_ROLE.ADMIN) {
      return next("/admins/sign-in");
    }

    return next();
  }

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

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next("/sign-in");
  }

  // 중개사 권한이 필요한데 중개사 권한이 없는 경우
  if (
    to.meta.roles.includes(USER_ROLE.AGENT) &&
    !to.meta.roles.includes(authStore.role)
  ) {
    // 로그인 자체를 안 한 사용자 -> 회원가입 화면으로 이동
    if (authStore.role === null) {
      return next("/sign-in");
    }

    if (agentStore.approvedStatus === AGENT_APPROVED_STATUS.PENDING) {
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
  if (to.path === "/agents/apply") {
    try {
      await agentStore.checkAgentInfo();
    } catch (error) {
      throw error;
    }
    if (agentStore.approvedStatus === AGENT_APPROVED_STATUS.PENDING) {
      alert("이미 중개사 인증 신청이 접수되어 관리자 심사 중입니다.");
      return next("/");
    }
  }

  //특정 권한이 필요한데 없는 경우 메인페이지로 이동
  if (to.meta.roles.length > 0 && !to.meta.roles.includes(authStore.role)) {
    alert("권한이 없습니다.");
    return next("/");
  }

  // 나머지는 통과
  next();
});

export default router;
