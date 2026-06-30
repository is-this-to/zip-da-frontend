/**
 * @param {*} val 검증할 값
 * @returns {string} 통과 시 '', 실패 시 에러메시지
 */

export const description = (val) => {
  if (!val || val.trim() === "") return "매물 설명을 입력해 주세요.";
  if (val.length > 2000) return "매물 설명은 2000자 이하로 입력해 주세요.";
  return "";
};

export const propertyType = (val) => {
  if (!val) return "매물 종류를 선택해 주세요.";
  return "";
};

export const transactionType = (val) => {
  if (!val) return "거래 종류를 선택해 주세요.";
  return "";
};

export const regionId = (val) => {
  if (!val) return "지역을 선택해 주세요.";
  return "";
};

export const price = (val, txType) => {
  if (txType !== "SALE") return "";
  if (!val || val <= 0) return "매매가를 입력해 주세요.";
  return "";
};

export const deposit = (val, txType) => {
  if (!["JEONSE", "MONTHLY_RENT", "SHORT_TERM"].includes(txType)) return "";
  if (!val || val <= 0)
    return txType === "JEONSE"
      ? "전세 보증금을 입력해 주세요."
      : "보증금을 입력해 주세요.";
  return "";
};

export const monthlyRent = (val, txType) => {
  if (!["MONTHLY_RENT", "SHORT_TERM"].includes(txType)) return "";
  if (!val || val <= 0)
    return txType === "MONTHLY_RENT"
      ? "월세 금액을 입력해 주세요."
      : "임대료를 입력해 주세요.";
  return "";
};

export const areaM2 = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (val <= 0 || val >= 10000)
    return "전용면적은 0보다 크고 10000보다 작아야 합니다.";
  return "";
};

export const roomCount = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (val < 0 || val > 100) return "방 수는 0~100 사이여야 합니다.";
  return "";
};

export const bathroomCount = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (val < 0 || val > 100) return "욕실 수는 0~100 사이여야 합니다.";
  return "";
};

export const imageUrls = (val) => {
  if (val && val.length > 10) return "이미지는 최대 10장까지 등록 가능합니다.";
  return "";
};

export const detailAddress = (val) => {
  if (!val || val.trim() === "") return "상세 주소를 입력해 주세요.";
  if (val.length > 255) return "상세 주소는 255자 이하로 입력해 주세요.";
  return "";
};
