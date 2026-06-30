import myAxios from "./myAxios";

// 내 정보 조회
export const getMyProfile = async () => {
  const response = await myAxios.get("/api/users/me");
  return response.data;
};

// 내 정보 수정
export const updateMyProfile = async (profile) => {
  const response = await myAxios.patch("/api/users/me", profile);
  return response.data;
};

// 비밀번호 변경
export const updateMyPassword = async (passwordUpdateRequest) => {
  const response = await myAxios.patch(
    "/api/users/me/password",
    passwordUpdateRequest,
  );
  return response.data;
};

// 공인중개사 프로필 이미지 파일 업로드
export const uploadAgentProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await myAxios.post("/api/agent-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// 내가 올린 매물 목록 조회
export const getMyProperties = async () => {
  const response = await myAxios.get("/api/users/me/properties");
  return response.data;
};

// 내 신고 내역 조회
export const getMyReports = async () => {
  const response = await myAxios.get("/api/users/me/reports");
  return response.data;
};

// 회원탈퇴
export const withdrawMembership = async (password) => {
  const response = await myAxios.delete("/api/users/me", {
    data: { password },
  });
  return response.data;
};
