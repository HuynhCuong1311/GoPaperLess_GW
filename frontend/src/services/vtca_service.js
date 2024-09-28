import { api } from "@/utils/api";

export const vtcaService = {
  getCertificates: (data) => {
    return api.post("vtca/getCertificates", {
      language: data.language,
      userId: data.userId,
      connectorName: data.connectorName,
    });
  },

  vtSign: (data, { signal }) => {
    return api.post("vtca/vtcaSignFile", data, { signal });
  },
};
