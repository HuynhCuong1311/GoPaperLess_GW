import CryptoJS from "crypto-js";

function hashAndExtractMiddleSixChars(input) {
  const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  const middleIndex = Math.floor(hash.length / 2) - 3;
  return hash.substring(middleIndex, middleIndex + 6);
}
export function generateFieldName(signerId, type) {
  const suffix = hashAndExtractMiddleSixChars(type + "-" + Date.now());
  const value = `${signerId}_${type}_${suffix}`;
  return { value, suffix };
}
