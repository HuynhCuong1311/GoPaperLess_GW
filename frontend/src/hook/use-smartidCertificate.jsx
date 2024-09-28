import { internalService } from "@/services/internal_service";
import { rsspService } from "@/services/rssp_service";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";

export const useSmartIdCertificate = () => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await rsspService.getCertificates(data);
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};

useSmartIdCertificate.propTypes = {
  data: PropTypes.object,
};

export const useIssCertificate = () => {
  const { mutate, data, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      const response = await internalService.getRsspCertificate(data);
      return response.data;
    },
  });
  return { mutate, data, isLoading, error };
};

export const useSmartIdSign = ({ signal }) => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: async (data) => {
      const response = await rsspService.signFile(data, { signal });
      return response.data;
    },
  });
  return { mutate, data, isLoading, isPending, error };
};
