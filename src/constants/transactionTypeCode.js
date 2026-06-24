const transactionType = {
  MONTHLY_RENT: "월세",
  JEONSE: "전세",
  SALE: "매매",
  SHORT_TERM: "단기",
};

Object.freeze(transactionType);

const getTransactionTypeName = (code) => {
  return transactionType[code] || code;
};

export default {
  transactionType,
  getTransactionTypeName,
};
