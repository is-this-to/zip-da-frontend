
  // axios 라이브러리 가져오기
import axios from 'axios';

// 공통 axios 인스턴스 생성
const myAxios = axios.create({
  // 백엔드 기본 주소
  baseURL: 'http://localhost:8080',

  // refreshToken 쿠키를 주고받아야 할 수 있어서 true
  withCredentials: true,
});

// 요청을 보내기 전에 실행되는 인터셉터
myAxios.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken 꺼내기
    const accessToken = localStorage.getItem('accessToken');

    // accessToken이 있으면 Authorization 헤더에 넣기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 수정된 요청 설정 반환
    return config;
  },

  (error) => {
    // 요청 보내기 전 에러가 나면 거절
    return Promise.reject(error);
  }
);

// 다른 파일에서 쓸 수 있게 내보내기
export default myAxios;
