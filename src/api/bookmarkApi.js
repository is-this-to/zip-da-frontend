import myAxios from "./myAxios";

// 마이페이지 찜 목록 조회 API
export const getMyBookmarkList = async () => {
  const response = await myAxios.get("/api/users/me/bookmarks");
  return response.data;
};

// 매물 목록/상세에서 사용할 찜 토글 API
// 매물 담당자가 하트 버튼에 이 함수를 연결하면 됩니다.
export const toggleBookmark = async (propertyId) => {
  const response = await myAxios.post("/api/bookmarks", {
    propertyId,
  });
  return response.data;
};
