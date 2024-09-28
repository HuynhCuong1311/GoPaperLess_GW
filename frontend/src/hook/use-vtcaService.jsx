import { vtcaService } from "@/services/vtca_service";
import { useMutation } from "@tanstack/react-query";

export const useVtCACertificate = () => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      console.log("data: ", data);
      const response = await vtcaService.getCertificates(data);
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};

export const useVtCASign = ({ signal }) => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await vtcaService.vtSign(data, { signal });
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};
