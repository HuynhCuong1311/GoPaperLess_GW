import { electronicService } from "@/services/electronic_service";
import { internalService } from "@/services/internal_service";
import { useMutation } from "@tanstack/react-query";

export const useCheckIdentity = () => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.checkIdentity(data);
      return response.data;
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useFaceAndCreate = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.faceAndCreate(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const usePerFormProcess = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.perFormProcess(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useUpdateSubject = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.updateSubject(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useOTPResend = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.processOTPResend(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useGetEidCertificate = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.checkCertificate(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useCreateCertificate = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.createCertificate(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useGetInforTaxCode = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.getInformation(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useCheckOwnerAndGetCertRssp = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await internalService.getRsspCertificate(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useCredentialOTP = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.credentialOTP(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useAuthorizeOTP = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.authorizeOTP(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

export const useFaceAndSignScal = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.faceAndSignScal(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};
