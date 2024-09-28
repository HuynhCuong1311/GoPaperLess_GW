import { apiService } from "@/services/api_service";
import { useQuery } from "@tanstack/react-query";

export const useConnectorList = (providerName) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getConnectorList"],
    queryFn: async () => {
      const response = await apiService.getConnecterProvider(providerName);
      return response.data;
    },
    enabled: !!providerName,
  });
  return { data, isLoading, error };
};

useConnectorList.propTypes = {};

export default useConnectorList;
