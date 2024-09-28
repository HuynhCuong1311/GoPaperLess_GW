import { fpsService } from "@/services/fps_service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const UseGetFields = (documentId) => {
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ["getField"],
    queryFn: async () => {
      return await fpsService.getFields({ documentId });
    },
    enabled: !!documentId,
  });
  return { data, isLoading, error, isPending };
};

export const UseAddSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.addSignature(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseUpdateSig = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.putSignature(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseAddTextField = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.addTextBox(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseFillInit = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, field, documentId }) => {
      return fpsService.fillInit(body, field, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseFillForm = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ body, type, documentId }) => {
      return fpsService.fillForm(body, type, documentId);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};

export const UseRemoveField = () => {
  const { mutate, data, isLoading, isPending, error } = useMutation({
    mutationFn: ({ documentId, field_name }) => {
      return fpsService.removeSignature({ documentId: documentId }, field_name);
    },
  });
  return { mutate, data, isLoading, isPending, error };
};
