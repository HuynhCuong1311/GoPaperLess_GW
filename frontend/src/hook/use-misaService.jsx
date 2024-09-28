import { misaService } from "@/services/misa_service";
import { useMutation } from "@tanstack/react-query";

export const useMisaCertificate = () => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await misaService.getCertificates(data);
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};

export const useMisaSign = ({ signal }) => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await misaService.misaSign(data, { signal });
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};
