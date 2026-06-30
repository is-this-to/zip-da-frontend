import myAxios from "./myAxios";

/**
 * 매물 도메인 API (담당: 임호탁 / feature/property_LHT)
 *
 *  - POST   /api/properties              매물 등록   (PROPERTY01)
 *  - GET    /api/properties/{id}         매물 상세   (PROPERTY04)
 *  - PATCH  /api/properties/{id}         매물 수정   (PROPERTY03 EXECUTE01)
 *  - PATCH  /api/properties/{id}/status  거래상태   (PROPERTY03 EXECUTE02)
 *  - DELETE /api/properties/{id}         매물 삭제   (PROPERTY02, soft delete)
 *
 * 응답은 모두 GlobalResponse 구조: { code, message, data }
 * 각 함수는 response.data.data (실제 데이터)만 반환.
 *
 * 이미지 업로드/삭제는 김민수님 영역(FILE01) Mock으로 임시 대체.
 * 김민수님 머지 후 uploadImage / deleteImage 함수만 교체.
 */

// ============ 매물 등록 ============
export const createProperty = async (request) => {
  const url = "/api/properties";
  const res = await myAxios.post(url, request);
  return res.data.data;
};

// ============ 매물 상세 조회 ============
export const getPropertyDetail = async (propertyId) => {
  const url = `/api/properties/${propertyId}`;
  const res = await myAxios.get(url);
  return res.data.data;
};

// ============ 매물 부분 수정 ============
export const updateProperty = async (propertyId, request) => {
  const url = `/api/properties/${propertyId}`;
  const res = await myAxios.patch(url, request);
  return res.data.data;
};

// ============ 거래상태 변경 ============
export const changePropertyStatus = async (propertyId, status) => {
  const url = `/api/properties/${propertyId}/status`;
  const res = await myAxios.patch(url, { status });
  return res.data.data;
};

// ============ 매물 삭제 (soft delete) ============
export const deleteProperty = async (propertyId) => {
  const url = `/api/properties/${propertyId}`;
  const res = await myAxios.delete(url);
  return res.data.data;
};

// ============ 찜 처리 ============

export const updatePropertyFavorite = async (propertyId) => {
  const url = "/api/bookmarks";

  const response = await myAxios.post(url, {
    propertyId,
  });

  return response.data.data;
};

// ===================== 이미지 (김민수님 FILE01 - 실제 API 호출) =====================

/**
 * 매물 이미지 업로드 (김민수님 FILE01 API).
 * POST /api/property-images
 *
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<string>} 업로드된 이미지의 fileUri (절대 URL)
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await myAxios.post("/api/property-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  // 백엔드 응답: { code, message, data: { fileUri: "http://localhost:8080/files/properties/..." } }
  return res.data.data.fileUri;
};

/**
 * 매물 이미지 삭제 (김민수님 FILE01 API).
 * DELETE /api/property-images?fileUri=...
 *
 * @param {string} fileUri - 삭제할 이미지의 fileUri
 */
export const deleteImage = async (fileUri) => {
  await myAxios.delete("/api/property-images", {
    params: { fileUri },
  });
};
