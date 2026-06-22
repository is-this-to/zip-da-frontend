import axios from "axios";
import { useAuthStore } from "../store/auth/useAuthStore";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // 클라이언트가 보내는 데이터 타입 json이다
    "Content-Type": "application/json"
  },
  withCredentials: true,
});

// reissue 요청 제외하고 클라이언트가 request를 보낼때 accesstoken을 헤더에 넣어서 보내도록함
// myAxios가 서버에 요청 보내기 전에 실행하는 함수 정의
// config: axios 요청 보낼때 들어가 있는 모든 정보를 모은 객체
myAxios.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  let accessToken = authStore.accessToken;
  const denyUrl = /^\/api\/auth\/tokes$/; // reissue 요청일 경우 요청 금지

  if(!denyUrl.test(config.url) && authStore.isLoggedIn) {
    // 액세스 토큰 만료 확인
    const claims = jwtDecode(accessToken);
    // 현재 시간 유닉스 타임스탬프로 변환
    const now = dayjs().unix();
    // claims의 exp를 dayjs unix에 맞게 포멧 
    const extTime = dayjs.unix(claims.exp).add(-2, 'minute').unix();
    if(now >= extTime) {
      try {
        await authStore.reissue();
        accessToken = authStore.accessToken;
      } catch (error) {
        throw error;
      }
    }
  }
  if(accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config
});

export default myAxios;
