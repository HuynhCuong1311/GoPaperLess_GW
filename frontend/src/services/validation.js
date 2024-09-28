import { api } from "@/utils/api";

export const validationService = {
  getView: ({ uploadToken }) => {
    return api.post("val/getView", { uploadToken });
  },
  getFileDetail: ({ uploadToken }) => {
    return api.post("val/getFileDetail", { uploadToken });
  },
  postBack: (data) => {
    return api.post("val/postback", data);
  },
  checkStatus: (data) => {
    return api.post("val/checkStatus", data);
  },
};
