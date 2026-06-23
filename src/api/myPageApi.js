import myAxios from "./myAxios";

// 내 정보 조회
export const getMyProfile = async () => {
  const response = await myAxios.get("/api/users/me");
  return response.data;
};

// 내 정보 수정
// 이메일은 서버에서 수정하지 않기 때문에 보내지 않아도 됩니다.
export const updateMyProfile = async (profile) => {
  const response = await myAxios.patch("/api/users/me", profile);
  return response.data;
};

// 공인중개사 프로필 이미지 파일 업로드
// 실제 파일 저장만 담당하고, DB 저장은 updateMyProfile에서 profileImageUrl로 처리합니다.
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

// 회원탈퇴 API는 백엔드 준비용입니다.
// 지금 화면에서는 버튼/모달만 만들고 실제 호출하지 않습니다.
export const withdrawMembership = async (password) => {
  const response = await myAxios.delete("/api/users/me", {
    data: password ? { password } : undefined,
  });
  return response.data;
};
