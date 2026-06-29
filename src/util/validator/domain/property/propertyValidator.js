import * as rule from "../../rule/propertyRule";

export default (form) => {
  const errors = {};
  const apply = (field, ...args) => {
    const msg = rule[field](...args);
    if (msg) errors[field] = msg;
  };

  apply("description", form.description);
  apply("propertyType", form.propertyType);
  apply("transactionType", form.transactionType);
  apply("regionId", form.regionId);
  apply("price", form.price, form.transactionType);
  apply("deposit", form.deposit, form.transactionType);
  apply("monthlyRent", form.monthlyRent, form.transactionType);
  apply("areaM2", form.areaM2);
  apply("roomCount", form.roomCount);
  apply("bathroomCount", form.bathroomCount);
  apply("imageUrls", form.imageUrls);
  apply("detailAddress", form.detailAddress);

  return errors;
};
