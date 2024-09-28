import dayjs from "dayjs";
import i18n from "./languages/i18n";

export const next = {
  // animationName: "banner",
  // animationDuration: "1s",
  // // animationIterationCount: "infinite",
  // animationIterationCount: "1",
  // animationDirection: "normal",
  // perspective: "1000",
  // backgroundAttachment: "fixed",

  border: "2px solid #f9da00",
  outline: "none",
  boxShadow: "0 0 0 0.2rem rgba(249, 218, 0, 0.25)",
};

export const validFocus = {
  border: "2px solid #f9da00",
  outline: "none",
  boxShadow: "0 0 0 0.2rem rgba(249, 218, 0, 0.25)",
};

export const getSignature = (value, signerId, workflowId) => {
  return value.find(
    (item) => item?.field_name === signerId && item?.workFlowId === workflowId
  );
};

export const getSigner = (workFlow) => {
  const signer = workFlow?.participants?.find(
    (item) => item.signerToken === workFlow.signerToken
  );
  return signer;
};

export const checkIsPosition = (workFlow) => {
  if (!workFlow) return false;
  //Begin: Check for Arrangement
  if (!workFlow.signerToken) return false;
  //End: Check for Arrangement
  const signer = workFlow.participants.find(
    (item) => item.signerToken === workFlow.signerToken
  );

  const metaInf1 = signer.metaInformation;
  if (
    metaInf1.pdf &&
    metaInf1.pdf.annotation &&
    (metaInf1.pdf.annotation.top ||
      metaInf1.pdf.annotation.left ||
      metaInf1.pdf.annotation.height ||
      metaInf1.pdf.annotation.width)
  ) {
    return true;
  } else {
    return false;
  }
};

export const checkSignerStatus = (item, signerToken) => {
  // console.log("item: ", item);
  let status = null;
  if (item.signerStatus === 2) {
    return (status = 2);
  }

  status = item.signerToken === signerToken ? 1 : 0;

  return status;
};

export const checkSignerWorkFlow = (item, signerToken) => {
  if (item.signerToken === signerToken) {
    return true;
  } else {
    return false;
  }
};

export const convertSignOptionsToProvider = (signingOptions) => {
  // convert list ["mobile", "smartid"] to ["MOBILE_ID_SIGNING","SMART_ID_SIGNING"]
  return signingOptions.map((item) => {
    switch (item) {
      case "mobile":
        return "MOBILE_ID_SIGNING";
      case "smartid":
        return "SMART_ID_SIGNING";
      case "usbtoken":
        return "USB_TOKEN_SIGNING";
      case "electronic_id":
        return "ELECTRONIC_ID";
      case "iss":
        return "ISS";
    }
  });
};

export const convertProviderToSignOption = (Provider) => {
  // convert list ["mobile", "smartid"] to ["MOBILE_ID_SIGNING","SMART_ID_SIGNING"]
  switch (Provider) {
    case "MOBILE_ID_SIGNING":
      return "mobile";
    case "SMART_ID_SIGNING":
      return "smartid";
    case "USB_TOKEN_SIGNING":
      return "usbtoken";
    case "ELECTRONIC_ID":
      return "electronic_id";
    case "ISS":
      return "internal signing service";
  }
};

export const getLang = () => {
  let lang = "English";
  if (typeof window.localStorage === "object") {
    if (typeof window.localStorage?.getItem !== "undefined") {
      lang = localStorage.getItem("language");
    }
  }
  // let lang = localStorage.getItem("language");
  switch (lang) {
    case "Việt Nam":
      lang = "VN";
      break;
    default:
      lang = "EN";
      break;
  }
  return lang;
};

export function removeBase64Prefix(base64String) {
  // Check if the string starts with the specified prefix
  const imageFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/bmp",
    "text/html",
    "application/pdf",
  ];
  // Duyệt qua mỗi định dạng và kiểm tra xem base64String có bắt đầu bằng định dạng nào không
  for (const format of imageFormats) {
    const prefix = `data:${format};base64,`;
    if (base64String.startsWith(prefix)) {
      // Nếu tìm thấy định dạng, loại bỏ prefix và trả về
      return base64String.substring(prefix.length);
    }
  }

  // Nếu không tìm thấy định dạng hình ảnh, trả về chuỗi ban đầu
  return base64String;
}

export function addBase64Prefix(base64String, extension) {
  // Xác định loại MIME dựa trên phần mở rộng của tên file
  // const extension = fileName.split(".").pop().toLowerCase();
  let mimeType = "";

  switch (extension) {
    case "jpg":
    case "jpeg":
      mimeType = "image/jpeg";
      break;
    case "png":
      mimeType = "image/png";
      break;
    case "gif":
      mimeType = "image/gif";
      break;
    case "pdf": // Thêm trường hợp cho định dạng PDF
      mimeType = "application/pdf";
      break;
  }

  // Tạo tiền tố dựa trên loại MIME đã xác định
  const base64Prefix = `data:${mimeType};base64,`;
  let newString = "";

  // Kiểm tra xem chuỗi base64 đã có tiền tố chưa
  if (base64String.startsWith(base64Prefix)) {
    // Nếu đã có tiền tố thì trả về nguyên trạng
    newString = base64String;
    return { mimeType, newString };
  } else {
    // Nếu chưa có tiền tố thì thêm tiền tố và trả về chuỗi mới
    newString = base64Prefix + base64String;
    return { mimeType, newString };
  }
}

export function extractDatePart(dateString) {
  // Kiểm tra xem chuỗi dateString có đúng định dạng date_DD/MM-YYYY không
  if (dateString.startsWith("date_")) {
    // Sử dụng slice để cắt bỏ phần 'date_'
    let extractedDate = dateString.slice(5);

    // Trả về phần cắt được (DD/MM-YYYY)
    return extractedDate.toUpperCase();
  } else {
    // Nếu chuỗi không đúng định dạng thì trả về null hoặc thông báo lỗi tùy theo yêu cầu
    return dateString.toUpperCase();
  }
}

export const checkWorkflowStatus = (workflow) => {
  return workflow?.participants?.every((item) => item?.signerStatus !== 1);
};

export const convertTime = (time) => {
  const date = new Date(time);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formattedDate = date
    .toLocaleString("en-US", options)
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, "$2/$1/$3 $4");

  return formattedDate;
}; // Output: 01/12/2023, 14:22:37

export const convertDate = (time) => {
  // convert Nov 14, 2024 2:41:20 PM to 14/11/2024
  // Create a new Date object from the input string
  let date = new Date(time);

  // Get the day, month, and year from the Date object
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero-indexed
  let year = date.getFullYear();

  // Format the day and month to be two digits
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Combine the parts into the desired format
  return `${day}/${month}/${year}`;
};

export const getUrlWithoutProtocol = () => {
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  return url.origin.replace(/^(https?:\/\/)/, "");
};

//check time is after now
export const checkTimeIsAfterNow = (time) => {
  const date = new Date(time);
  const now = new Date();
  return date > now;
};

export const checkTimeIsBeforeNow = (time) => {
  if (time) {
    const date = new Date(time);
    const now = new Date();
    return date < now;
  } else {
    return false;
  }
};

//convert time to local time
export const convertTimeToLocal = (time) => {
  const date = new Date(time);
  return date.toLocaleString();
};

export const handleDateTimeChange = (time) => {
  const currentTime = dayjs();
  // console.log("currentTime: ", currentTime);
  const selectedDateTimeWithTime = dayjs(time)
    .set("hour", currentTime.hour())
    .set("minute", currentTime.minute())
    .set("second", currentTime.second());
  return selectedDateTimeWithTime;
};

export const convertTypeEid = (criteria) => {
  switch (criteria) {
    case "CITIZEN-IDENTITY-CARD":
      return "CITIZEN_CARD";
    case "PASSPORT-ID":
      return "PASSPORT";
    // case "MOBILE_ID_SIGNING":
    //   return "Mobile ID";
    // case "SMART_ID_SIGNING":
    //   return "Smart ID";
    // case "USB_TOKEN_SIGNING":
    //   return "USB Token";
  }
};

export const convertTypeEidToCriteria = (criteria) => {
  switch (criteria) {
    case "CITIZEN_CARD":
      return "CITIZEN-IDENTITY-CARD";
    case "PASSPORT":
      return "PASSPORT-ID";
    case "Mobile ID":
      return "MOBILE_ID_SIGNING";
    case "Smart ID":
      return "SMART_ID_SIGNING";
    case "USB Token":
      return "USB_TOKEN_SIGNING";
  }
};

export const convertSmartIdType = (type) => {
  switch (type) {
    case "CITIZEN_CARD":
      return "CITIZEN-IDENTITY-CARD";
    case "Mobile ID":
      return "MOBILE_ID_SIGNING";
    case "Smart ID":
      return "SMART_ID_SIGNING";
    case "USB Token":
      return "USB_TOKEN_SIGNING";
  }
};

export const createValidName = (value) => {
  switch (value) {
    case "valid Signature":
      return i18n.t("validation.validSig");
    case "indeterminate Signature":
      return i18n.t("validation.indeterminateSig");
    case "invalid Signature":
      return i18n.t("validation.invalidSig");
    case "valid Seal":
      return i18n.t("validation.validSeal");
    case "indeterminate Seal":
      return i18n.t("validation.indeterminateSeal");
    case "invalid Seal":
      return i18n.t("validation.invalidSeal");
    default:
      return null;
  }
};

export const createValidIcon = (value) => {
  switch (value) {
    case "overview":
      return "<InsertDriveFileOutlinedIcon />";
    case "signatures":
      return "<GroupOutlinedIcon />";
    case "seals":
      return "<WorkspacePremiumIcon />";
    case "details":
      return "<DescriptionOutlinedIcon />";
    default:
      return "Unknown Tab";
  }
};

export const createValidLabel = (value) => {
  switch (value) {
    case "overview":
      return i18n.t("validation.tab1");
    case "signatures":
      return i18n.t("validation.tab2");
    case "seals":
      return i18n.t("validation.tab3");
    case "details":
      return i18n.t("validation.tab4");
    default:
      return "Unknown Tab";
  }
};

export const createValidTitle = (value) => {
  switch (value) {
    case "Signature is valid":
      return i18n.t("validation.sigValidTitle2");
    case "Seal is valid":
      return i18n.t("validation.sealValidTitle2");
    default:
      return null;
  }
};

export const createValidSubTitle = (value) => {
  switch (value) {
    case "Electronic Signature":
      return i18n.t("validation.signSubTitle");
    case "Electronic Seal":
      return i18n.t("validation.sealSubTitle");
    default:
      return null;
  }
};

export const checkEseal = (cert) => {
  const certElement = cert.name;
  // const certElement = "CN=CMC-CA Test, S=HCM, C=VN";

  const cccdRegex = /\bCCCD:\b/;
  const cmndRegex = /\bCMND:\b/;
  const bhxhRegex = /\bBHXH:\b/;
  const hcRegex = /\bHC:\b/;
  const pidRegex = /\bPID:\b/;
  const ppidRegex = /\bPPID:\b/;

  // const cert =
  //   "OID.2.5.4.20=0901790767, EMAILADDRESS=huynhcuong@gmail.com, UID=CCCD:079083011315, CN=Huỳnh Cường, ST=Hồ Chí Minh, C=VN";
  // check if cert contains "UID" and cert contains "CCCD" or "CMND"
  return (
    !cccdRegex.test(certElement) && // Using the regular expression test method
    !cmndRegex.test(certElement) &&
    !hcRegex.test(certElement) &&
    !bhxhRegex.test(certElement) &&
    !pidRegex.test(certElement) &&
    !ppidRegex.test(certElement)
  );
};

export const debounce = (fn, delay = 1000) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export const downloadCertFromPEM = (data, name) => {
  const blob = new Blob([data], { type: "application/x-x509-ca-cert" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.cer`);
  document.body.appendChild(link);
  link.click();
  // console.log("data: ", data);
};

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// export function capitalLize(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// }

export function capitalLize(str) {
  // Tách chuỗi thành các câu bằng dấu chấm, dấu chấm than hoặc dấu chấm hỏi
  const sentences = str.split(/\.|\?|!/);

  // Lặp qua mỗi câu và viết hoa chữ cái đầu của nó
  const capitalizedSentences = sentences.map((sentence) => {
    // Loại bỏ các khoảng trắng thừa ở đầu câu trước khi viết hoa
    sentence = sentence.trim();

    // Viết hoa chữ cái đầu của câu
    if (sentence.length > 0) {
      sentence =
        sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    }
    return sentence;
  });

  // Kết hợp lại các câu thành một chuỗi và trả về
  return capitalizedSentences.join(". ");
}

export const removeEmptyValues = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Kiểm tra xem giá trị có rỗng hay không
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};

export const isEmptyFunc = (func) => {
  // Biểu diễn chuỗi của hàm rỗng
  const emptyFunctionString = "()=>{}";

  // Biểu diễn chuỗi của hàm func
  const funcString = func.toString();

  // So sánh chuỗi biểu diễn của hàm func với chuỗi của hàm rỗng
  return funcString === emptyFunctionString;
};

export const getFileSize = (base64) => {
  // return file size in kB
  const sizeInBytes = 4 * Math.ceil(base64.length / 3) * 0.5624896334383812;
  return (sizeInBytes / 1024).toFixed(2);
};

export function parseStringToObject(str) {
  // Tách chuỗi theo dấu phẩy và loại bỏ khoảng trắng dư thừa
  const keyValuePairs = str.split(",").map((pair) => pair.trim());

  // Khởi tạo object rỗng
  const obj = {};

  // Duyệt qua từng cặp key-value và thêm vào object
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    obj[key] = value;
  });

  return obj;
}

export const maskedEmail = (email) => {
  try {
    // Tách phần tên người dùng và tên miền của email
    let [user, domain] = email.split("@");

    // Che giấu phần tên người dùng, chỉ giữ lại 3 ký tự đầu tiên, phần còn lại là dấu sao
    let hiddenUser =
      user.slice(0, 3) + "*".repeat(Math.max(user.length - 3, 0));

    const hiddenDomain =
      domain.slice(0, 2) +
      "*".repeat(Math.max(domain.length - 4, 0)) +
      domain.slice(-2);

    return hiddenUser + "@" + hiddenDomain;
  } catch (e) {
    return e.message;
  }
};

export const formatStringWithSpaces = (input) => {
  if (!input) return input;
  // Tách chuỗi thành các đoạn nhỏ mỗi đoạn gồm 2 ký tự
  let chunks = input.match(/.{1,2}/g);

  // Gộp các đoạn nhỏ thành một chuỗi với khoảng trắng giữa các đoạn
  let formattedString = chunks.join(" ");

  return formattedString;
};

export const removeBeginEndCertificate = (certificate) => {
  if (typeof certificate !== "string") {
    throw new Error("Invalid input: certificate must be a string");
  }

  // Sử dụng biểu thức chính quy để tìm và bỏ phần BEGIN và END
  const beginRegex = /-----BEGIN CERTIFICATE-----/;
  const endRegex = /-----END CERTIFICATE-----/;

  // Loại bỏ phần BEGIN nếu có
  let cleanedCert = certificate.replace(beginRegex, "");

  // Loại bỏ phần END nếu có
  cleanedCert = cleanedCert.replace(endRegex, "");

  // Loại bỏ các dòng trống và khoảng trắng dư thừa
  cleanedCert = cleanedCert.replace(/\r?\n|\r/g, "").trim();

  return cleanedCert;
};

export const decodeBase64 = (base64String) => {
  try {
    // Sử dụng atob để decode chuỗi base64
    const decodedString = atob(base64String);
    const newString = removeBeginEndCertificate(decodedString);
    return newString;
  } catch (error) {
    console.error("Error decoding base64 string:", error);
    return null;
  }
};

export const filterCertificates = (signer, listCertificate) => {
  let newList = [];

  if (
    signer.metaInformation?.certificate &&
    typeof signer.metaInformation.certificate === "string"
  ) {
    // console.log("decode: ", decodeBase64(signer.metaInformation.certificate));
    const decode = decodeBase64(signer.metaInformation.certificate);
    newList = listCertificate.filter(
      (item) => item.value === decode || item.cert === decode
    );
  } else if (
    signer.metaInformation.certificate_sn &&
    typeof signer.metaInformation.certificate_sn === "string"
  ) {
    // console.log("object");
    newList = listCertificate.filter(
      (item) =>
        item.subject?.serialNumber?.toLowerCase() ===
          signer.metaInformation.certificate_sn.toLowerCase() ||
        item.serialNumber?.toLowerCase() ===
          signer.metaInformation.certificate_sn.toLowerCase()
    );
  } else {
    newList = listCertificate;
  }

  return newList;
};
export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// module.exports = {
//   next,
//   getSignature,
//   getSigner,
//   checkIsPosition,
//   checkSignerStatus,
//   checkSignerWorkFlow,
//   convertSignOptionsToProvider,
//   convertProviderToSignOption,
//   getLang,
//   removeBase64Prefix,
//   addBase64Prefix,
//   extractDatePart,
//   checkWorkflowStatus,
//   convertTime,
//   getUrlWithoutProtocol,
//   checkTimeIsAfterNow,
//   checkTimeIsBeforeNow,
//   convertTimeToLocal,
//   handleDateTimeChange,
//   convertTypeEid,
//   convertTypeEidToCriteria,
//   convertEidType,
//   createValidName,
//   createValidIcon,
//   createValidLabel,
//   createValidTitle,
//   createValidSubTitle,
//   checkEseal,
//   debounce,
//   downloadCertFromPEM,
//   isValidEmail,
//   capitalLize,
//   removeEmptyValues,
//   isEmptyFunc,
//   getFileSize,
//   parseStringToObject,
//   maskedEmail,
//   formatStringWithSpaces,
//   removeBeginEndCertificate,
//   filterCertificates
// };
