/**
 * 지역 마스터 (하드코딩 임시 데이터).
 *
 * 백엔드 region 테이블 시드 데이터와 동일.
 * 추후 GET /api/regions API 구현되면 동적으로 받아오도록 교체 예정.
 */
export const REGIONS = [
  { regionId: 1, province: "부산광역시", city: "해운대구", district: "우동" },
  { regionId: 2, province: "부산광역시", city: "수영구", district: "광안동" },
  { regionId: 3, province: "서울특별시", city: "강남구", district: "역삼동" },
  { regionId: 4, province: "서울특별시", city: "마포구", district: "서교동" },
];

// 옵션 마스터 (option 테이블 시드 데이터와 동일)
export const OPTIONS = [
  { optionId: 1, name: "엘리베이터" },
  { optionId: 2, name: "주차장" },
  { optionId: 3, name: "에어컨" },
  { optionId: 4, name: "냉장고" },
  { optionId: 5, name: "세탁기" },
  { optionId: 6, name: "인덕션" },
  { optionId: 7, name: "가스레인지" },
  { optionId: 8, name: "전자레인지" },
  { optionId: 9, name: "붙박이장" },
  { optionId: 10, name: "신발장" },
  { optionId: 11, name: "베란다" },
  { optionId: 12, name: "CCTV" },
  { optionId: 13, name: "현관보안" },
  { optionId: 14, name: "인터넷" },
  { optionId: 15, name: "반려동물" },
  { optionId: 16, name: "비데" },
];
