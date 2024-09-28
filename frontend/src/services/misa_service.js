import { api } from "@/utils/api";

export const misaService = {
  getCertificates: (data) => {
    return api.post("misa/getCertificates", data);
  },
  misaSign: (data, { signal }) => {
    return api.post("misa/misaSignFile", data, { signal });
  },
};
