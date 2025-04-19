export type ParcelResponseDto = {
  id: number;
  name: string;
  store: string;
  received: boolean;
  emailId?: string;
  createdAt: Date;
};

export type ListParcelsResponseDto = ParcelResponseDto[];

export type CreateParcelRequestDto = {
  name: string;
  store: string;
};
export type CreateParcelResponseDto = ParcelResponseDto;

export type UpdateParcelRequestDto = Partial<{
  name: string;
  store: string;
  received: boolean;
}>;
export type UpdateParcelResponseDto = ParcelResponseDto;

export type RegenerateParcelResponseDto = ParcelResponseDto;

export type RefreshParcelsResponseDto = {
  numCreated: number;
};
