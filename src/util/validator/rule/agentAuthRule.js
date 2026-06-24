export const licenseNo = (val) => {
  const regexp = /^(?=(?:.*\d){8,14}$)[0-9-]+$/;
  if (!val) {
    return "이메일은 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "이메일 양식이 올바르지 않습니다.";
  }

  return "";
};

export const businessNo = (val) => {
  const regexp = /^^\d{3}-?\d{2}-?\d{5}$$/;
  if (!val) {
    return "비밀번호는 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.";
  }

  return "";
};

export const officeName = (val) => {
  if (!val) {
    return "비밀번호는 필수입니다.";
  }

  if (val.length() > 100) {
    return "중개사무소명은 100자 이하로 입력해 주세요.";
  }

  return "";
};
