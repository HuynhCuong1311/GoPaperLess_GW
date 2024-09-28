import { api } from "@/utils/api";

export const internalService = {
  getRsspCertificate: (data) => {
    return api.post("/internal/getRsspCertificate", data);
  },
};
