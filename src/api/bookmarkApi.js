// src/api/bookmarkApi.js

// 공통 axios 가져오기
import myAxios from './myAxios';

// 마이페이지 찜 목록 조회 API
export const getMyBookmarkList = async () => {
  // 로그인한 유저 기준 찜 목록 조회
  // userId를 params로 보내지 않음
  const response = await myAxios.get('/api/users/me/bookmarks');

  // GlobalResponse 전체 반환
  return response.data;
};
