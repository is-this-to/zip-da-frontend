const reportStatus = {
  RECEIVED: "접수",
  IN_PROGRESS: "처리중",
  RESOLVED: "완료",
};

Object.freeze(reportStatus);

const getReportStatusName = (code) => {
  return reportStatus[code] || code;
};

export default {
  reportStatus,
  getReportStatusName,
};
