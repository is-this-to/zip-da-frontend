const propertyType = {
  ONE_ROOM: "원룸",
  TWO_ROOM: "투룸",
  OFFICETEL: "오피스텔",
  VILLA: "빌라",
  HOUSE: "주택",
};

Object.freeze(propertyType);

const getPropertyTypeName = (code) => {
  return propertyType[code] || code;
};

export default {
  propertyType,
  getPropertyTypeName,
};
