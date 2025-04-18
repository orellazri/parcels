export type ParcelResponseDto = {
  id: number;
  name: string;
  store: string;
  received: boolean;
  createdAt: Date;
};

export type ListParcelsResponseDto = ParcelResponseDto[];

export type UpdateParcelRequestDto = Partial<{
  name: string;
  store: string;
  received: boolean;
}>;
export type UpdateParcelResponseDto = ParcelResponseDto;

export type RefreshParcelsResponseDto = {
  numCreated: number;
};
