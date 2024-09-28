import { generateFieldName } from "./getField";

export const sigField = (value, signerId, signInfo) => {
  const signatureField = generateFieldName(signerId, value);
  return {
    type: value,
    field_name: signatureField.value,
    page: signInfo.page,
    dimension: {
      x: signInfo.x,
      y: signInfo.y,
      width: 22,
      height: 5,
    },
    suffix: signatureField.suffix,
    visible_enabled: true,
    remark: [signerId],
  };
};

export const initField = (value, signerId, signInfo) => {
  const fieldName = generateFieldName(signerId, value);
  return {
    type: value,
    field_name: fieldName.value,
    page: signInfo.page,
    dimension: {
      x: signInfo.x,
      y: signInfo.y,
      width: 22,
      height: 5,
    },
    suffix: fieldName.suffix,
    visible_enabled: true,
    required: true,
    remark: [signerId],
  };
};
