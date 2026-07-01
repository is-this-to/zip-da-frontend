/**
 * 매물 도메인 enum 한글 매핑 (담당: 임호탁)
 *
 * 백엔드 enum (com.zipdabackend.global.constant)과 1:1 대응.
 * 백엔드 응답이 { code, description } 객체 형식이라 description도 함께 활용 가능.
 *
 * 사용 예:
 *   <option v-for="t in PROPERTY_TYPES" :key="t.code" :value="t.code">
 *     {{ t.label }}
 *   </option>
 */

// 매물 종류
export const PROPERTY_TYPES = [
  { code: "ONE_ROOM", label: "원룸" },
  { code: "TWO_ROOM", label: "투룸" },
  { code: "OFFICETEL", label: "오피스텔" },
  { code: "VILLA", label: "빌라" },
  { code: "HOUSE", label: "주택" },
];

// 거래 종류
export const TRANSACTION_TYPES = [
  { code: "SALE", label: "매매" },
  { code: "JEONSE", label: "전세" },
  { code: "MONTHLY_RENT", label: "월세" },
  { code: "SHORT_TERM", label: "단기임대" },
];

// 매물 상태 (거래상태 변경 시 사용)
export const PROPERTY_STATUSES = [
  { code: "FOR_SALE", label: "판매중" },
  { code: "COMPLETED", label: "거래완료" },
];

// 출처 (백엔드가 user role에 따라 자동 설정, 프론트에선 표시용으로만 사용)
export const SOURCE_TYPES = [
  { code: "DIRECT", label: "직접등록" },
  { code: "AGENT", label: "공인중개사" },
];

// code → label 변환 헬퍼
export const getLabel = (list, code) => {
  const found = list.find((item) => item.code === code);
  return found ? found.label : code;
};
