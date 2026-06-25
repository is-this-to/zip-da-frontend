const reportStatus = {
  RECEIVED: "접수",
  REJECTED: "반려",
  DELETED: "삭제",
};

Object.freeze(reportStatus);

const getReportStatusName = (code) => {
  return reportStatus[code] || code;
};

export default {
  reportStatus,
  getReportStatusName,
};
