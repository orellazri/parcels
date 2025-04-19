import { api } from "@/lib/api";
import {
  GetCreditsResponseDto,
  ListParcelsResponseDto,
  RefreshParcelsResponseDto,
  UpdateParcelRequestDto,
  UpdateParcelResponseDto,
} from "@parcels/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListParcels(received: boolean) {
  return useQuery<ListParcelsResponseDto>({
    queryKey: ["parcels", received],
    queryFn: async () => {
      const response = await api.get<ListParcelsResponseDto>(`/parcels${received ? "?received=true" : ""}`);
      return response.data;
    },
  });
}

export function useUpdateParcel() {
  const queryClient = useQueryClient();

  return useMutation<UpdateParcelResponseDto, Error, { id: number; payload: UpdateParcelRequestDto }>({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch<UpdateParcelResponseDto>(`/parcels/${id}`, payload);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useDeleteParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/parcels/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useRegenerateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/parcels/${id}/regenerate`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useRefreshParcels() {
  const queryClient = useQueryClient();

  return useMutation<RefreshParcelsResponseDto>({
    mutationFn: async () => {
      const response = await api.get("/parcels/refresh");
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useGetCredits() {
  return useQuery<GetCreditsResponseDto>({
    queryKey: ["credits"],
    queryFn: async () => {
      const response = await api.get<GetCreditsResponseDto>("/credits");
      return response.data;
    },
  });
}
