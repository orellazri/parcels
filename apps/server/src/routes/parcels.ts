import {
  CreateParcelRequestDto,
  CreateParcelResponseDto,
  ListParcelsResponseDto,
  RefreshParcelsResponseDto,
  RegenerateParcelResponseDto,
  UpdateParcelRequestDto,
} from "@parcels/common";
import { FastifyInstance } from "fastify";
import {
  createParcel,
  deleteParcel,
  listParcels,
  refreshParcels,
  regenerateParcel,
  updateParcel,
} from "../services/parcels";

export const parcelsRoutes = (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: { received?: string }; Reply: ListParcelsResponseDto }>("/", async (request, reply) => {
    const received = request.query.received === "true";
    const parcels = await listParcels(received);
    reply.send(parcels);
  });

  fastify.post<{ Body: CreateParcelRequestDto; Reply: CreateParcelResponseDto }>("/", async (request, reply) => {
    const parcel = await createParcel(request.body);
    reply.send(parcel);
  });

  fastify.patch<{ Params: { id: number }; Body: UpdateParcelRequestDto }>("/:id", async (request, reply) => {
    const parcel = await updateParcel(request.params.id, request.body);
    reply.send(parcel);
  });

  fastify.delete<{ Params: { id: number } }>("/:id", async (request, reply) => {
    await deleteParcel(request.params.id);
    reply.send({ message: "Parcel deleted" });
  });

  fastify.get<{ Params: { id: number }; Reply: RegenerateParcelResponseDto }>(
    "/:id/regenerate",
    async (request, reply) => {
      const parcel = await regenerateParcel(request.params.id);
      reply.send(parcel);
    },
  );

  fastify.get<{ Reply: RefreshParcelsResponseDto }>("/refresh", async (request, reply) => {
    const numCreated = await refreshParcels();
    reply.send({ numCreated });
  });
};
