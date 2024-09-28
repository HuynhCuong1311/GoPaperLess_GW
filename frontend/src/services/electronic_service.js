import { api } from "@/utils/api";

export const electronicService = {
  checkIdentity: (data) => {
    return api.post("/elec/checkPersonalCode", data);
  },
  faceAndCreate: (data) => {
    return api.post("/elec/faceAndCreate", data);
  },
  updateSubject: (data) => {
    return api.post("/elec/updateSubject", data);
  },
  perFormProcess: (data) => {
    return api.post("/elec/processPerForm", data);
  },
  processOTPResend: (data) => {
    return api.post("/elec/processOTPResend", data);
  },
  checkCertificate: (data) => {
    return api.post("/elec/checkCertificate", data);
  },
  createCertificate: (data) => {
    return api.post("/elec/createCertificate", data);
  },
  getInformation: (data) => {
    return api.post("/elec/getInformation", data);
  },
  credentialOTP: (data) => {
    return api.post("/elec/credentialOTP", data);
  },
  authorizeOTP: (data) => {
    return api.post("/elec/authorizeOTP", data);
  },

  faceAndSignScal: (data) => {
    return api.post("/elec/faceAndSignScal", data);
  },
};
