import { isService } from "@/services/is_service";
import { useMutation } from "@tanstack/react-query";

export const useConnectWS = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.connectWS(data);
      return response;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useConnectWS.propTypes = {};

export const useGetTokenCertificate = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.getCertificate(data);
      return response;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useGetTokenCertificate.propTypes = {};

export const useReadCard = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.readCard(data);
      return response;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useReadCard.propTypes = {};

export const useTokenGetSignature = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.signTokenCertificate(data);
      return response;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useUsbHash = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.getHash(data);
      return response.data;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useUsbHash.propTypes = {};

export const useUsbPackFile = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await isService.packFile(data);
      return response.data;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useUsbPackFile.propTypes = {};
