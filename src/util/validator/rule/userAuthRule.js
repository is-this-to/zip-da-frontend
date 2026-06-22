/**
 * @param {string} val 검증할 문자열
 * @returns {string} 통과시 빈문자열(''), 실패 시 에러메시지
 */

export const email = (val) => {
  const regexp =
    /^[0-9a-zA-Z](?!.*?[\-_.]{2})[a-zA-Z0-9\-_.]{3,63}@[0-9a-zA-Z](?!.*?[\-_.]{2})[a-zA-Z0-9\-_.]{3,63}\.[a-zA-Z]{2,3}$/;
  if (!val) {
    return "이메일은 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "이메일 양식이 올바르지 않습니다.";
  }

  return "";
};

export const password = (val) => {
  const regexp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;
  if (!val) {
    return "비밀번호는 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.";
  }

  return "";
};

export const passwordCk = (password, passwordCk) => {
  const regexp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;

  if (!passwordCk) {
    return "비밀번호 확인은 필수입니다.";
  }

  return password === passwordCk
    ? ""
    : "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
};

export const name = (val) => {
  const regexp = /^[a-zA-Z가-힣]{2,40}$/;

  if (!val) {
    return "이름은 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "이름은 영문 대소문자와 한글만 사용하여 2~40자로 입력해주세요. ";
  }

  return "";
};

export const nick = (val) => {
  const regexp = /^[0-9a-zA-Z가-힣]{2,20}$/;

  if (!val) {
    return "닉네임은 필수입니다.";
  }

  if (!regexp.test(val)) {
    return "닉네임은 숫자, 영문 대소문자와 한글만 사용하여 2~20자로 입력해주세요.";
  }

  return "";
};

export const phone = (val) => {
  const regexp = /^01[016789]-?\d{3,4}-?\d{4}$/;

  if (!val) {
    return "";
  }

  if (!regexp.test(val)) {
    return "휴대폰 번호 형식이 올바르지 않습니다.";
  }
};
