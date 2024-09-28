import { electronicService } from "@/services/electronic_service";
import { useMutation } from "@tanstack/react-query";

export const useIdentity = (cbSuccess) => {
  const { mutate, mutateAsync, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await electronicService.checkIdentity(data);
      return response.data;
    },
    onSuccess: () => {
      cbSuccess?.();
    },
  });
  return { mutate, mutateAsync, data, isLoading, error };
};

useIdentity.propTypes = {};

export default useIdentity;
