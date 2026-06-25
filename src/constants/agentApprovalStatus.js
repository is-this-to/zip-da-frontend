const agentApprovalStatus = {
  PENDING: "승인대기",
  APPROVED: "승인완료",
  REJECTED: "반려",
};

Object.freeze(agentApprovalStatus);

const getAgentApprovalStatusName = (code) => {
  return agentApprovalStatus[code] || code;
};

export default {
  agentApprovalStatus,
  getAgentApprovalStatusName,
};
