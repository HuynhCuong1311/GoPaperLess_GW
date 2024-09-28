import { apiService } from "@/services/api_service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const UseUpdateQr = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.updateQr(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseGetCertDetail = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.getCertDetail(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseGetBindData = (bind_token) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getBindData"],
    queryFn: async () => {
      return await apiService.getBindData({ bind_token });
    },
    enabled: !!bind_token,
  });
  return { data, isLoading, error };
};

export const UseSaveConfig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.saveConfig(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseGetHeaderFooter = (signingToken) => {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["getHeaderFooter"],
    queryFn: () => {
      const response = apiService.checkHeaderFooter(signingToken);
      return response;
    },
    enabled: !!signingToken,
  });
  return { data, isLoading, error, isPending };
};

export const UseGetViewFromQr = () => {
  const { data, isLoading, isPending, error } = useQuery({
    mutationFn: (body) => {
      return apiService.getView(body);
    },
  });
  return { data, isLoading, isPending, error };
};

export const UseGetQryptoInfo = (qrypto, index) => {
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ["getQryptoInfo", index],
    queryFn: async () => {
      return await apiService.getQryptoInfo({ qrypto });
    },
    enabled: !!qrypto,
  });
  return { data, isLoading, error, isPending };
};

// export const UseGetQryptoInfo = () => {
//   const { mutate, data, isLoading, isPending, error } = useMutation({
//     mutationFn: ({ qrypto }) => {
//       return apiService.getQryptoInfo({ qrypto });
//     },
//   });
//   return { mutate, data, isLoading, isPending, error };
// };

export const UseCheckType = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.checkType(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseCheckType2 = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: (body) => {
      return apiService.checkType2(body);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};
