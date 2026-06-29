const agentApprovedStatus = {
  APPROVED: "활동 중",
  PENDING: "심사 중",
  REJECTED: "거부됨",
};

Object.freeze(agentApprovedStatus);

const getAgentApprovedStatusName = (code) => {
  return agentApprovedStatus[code] || code;
};

export default {
  agentApprovedStatus,
  getAgentApprovedStatusName,
};
