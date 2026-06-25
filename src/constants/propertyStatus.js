const propertyStatus = {
  FOR_SALE: "판매중",
  COMPLETED: "거래완료",
  HIDDEN: "숨김",
};

Object.freeze(propertyStatus);

const getPropertyStatusName = (code) => {
  return propertyStatus[code] || code;
};

export default {
  propertyStatus,
  getPropertyStatusName,
};
