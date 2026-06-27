const reportType = {
  INCORRECT_PRICE: "허위 가격",
  ALREADY_SOLD: "거래완료 매물",
  DUPLICATE_LISTING: "중복 게시",
  PHOTO_MISMATCH: "사진 불일치",
  OTHER: "기타",
};

Object.freeze(reportType);

const getReportTypeName = (code) => {
  return reportType[code] || code;
};

export default {
  reportType,
  getReportTypeName,
};
