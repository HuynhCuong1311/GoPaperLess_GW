import { api } from "@/utils/api";

export const apiService = {
  checkHeaderFooter: (signingToken) => {
    return api.post("/uiApi/checkHeader", {
      signingToken,
    });
  },
  getHeaderFooter: (enterpriseId) => {
    return api.post("/uiApi/headerFooter", {
      enterpriseId,
    });
  },
  checkWorkFlow: (data) => {
    return api.post("/uiApi/checkWorkFlow", data);
  },
  checkPerMission: (data) => {
    return api.post("/uiApi/checkPerMission", data);
  },
  getSigningWorkFlow: async (signingToken) => {
    const response = await api.post("/uiApi/getSigningWorkFlow", {
      signingToken,
    });
    return response;
  },
  getSignedInfo: async ({ firstFileId }) => {
    const response = await api.post("/uiApi/getSignedInfo", {
      fileId: firstFileId,
    });
    return response.data;
  },

  getConnecterProvider(providerName) {
    return api.post("/uiApi/getConnecterProvider", {
      signingOptions: providerName,
    });
  },

  getPrefixList(lang) {
    return api.post("/uiApi/getPrefixList", {
      language: lang,
    });
  },
  getView: ({ qr }) => {
    return api.post("/uiApi/getFromQR", { qr });
  },

  updateQr: async (data) => {
    const response = await api.post("/uiApi/updateQr", data);
    return response.data;
  },

  getCertDetail: async ({ cert }) => {
    const response = await api.post("/uiApi/getCertDetail", { cert });
    return response.data;
  },

  approve: async (data) => {
    const response = await api.post("/uiApi/approve", data);
    return response.data;
  },

  shareToSign: async (data) => {
    const response = await api.post("/uiApi/shareToSign", data);
    return response.data;
  },

  getBindData: async (data) => {
    const response = await api.post("/uiApi/getBindData", data);
    return response.data;
  },

  saveConfig: async (data) => {
    const response = await api.post("/uiApi/saveConfig", data);
    return response.data;
  },

  getQryptoInfo: async ({ qrypto }) => {
    const response = await api.post("/uiApi/getQryptoInfo", { qrypto });
    return response.data;
  },

  checkType: async (data) => {
    const response = await api.post("/uiApi/checkType", data);
    return response.data;
  },

  checkType2: async (data) => {
    const response = await api.post("/uiApi/checkType2", data);
    return response.data;
  },
};
