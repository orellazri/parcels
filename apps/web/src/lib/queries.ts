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
      const response = await fetch(`/api/parcels${received ? "?received=true" : ""}`);
      if (!response.ok) {
        throw new Error("Failed to fetch parcels");
      }
      return response.json();
    },
  });
}

export function useUpdateParcel() {
  const queryClient = useQueryClient();

  return useMutation<UpdateParcelResponseDto, Error, { id: number; payload: UpdateParcelRequestDto }>({
    mutationFn: async ({ id, payload }) => {
      const response = await fetch(`/api/parcels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update parcel");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useDeleteParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/parcels/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete parcel");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useRegenerateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/parcels/${id}/regenerate`);
      if (!response.ok) {
        throw new Error("Failed to regenerate parcel");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useRefreshParcels() {
  const queryClient = useQueryClient();

  return useMutation<RefreshParcelsResponseDto>({
    mutationFn: async () => {
      const response = await fetch("/api/parcels/refresh");
      if (!response.ok) {
        throw new Error("Failed to refresh parcels");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useGetCredits() {
  return useQuery<GetCreditsResponseDto>({
    queryKey: ["credits"],
    queryFn: async () => {
      const response = await fetch("/api/credits");
      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }
      return response.json();
    },
  });
}
