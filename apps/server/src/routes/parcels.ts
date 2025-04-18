import { deleteParcel, listParcels, refreshParcels, regenerateParcel, updateParcel } from "@/services/parcels";
import { ListParcelsResponseDto, RefreshParcelsResponseDto, UpdateParcelRequestDto } from "@parcels/common";
import { FastifyInstance } from "fastify";

export const parcelsRoutes = (fastify: FastifyInstance) => {
  fastify.get<{ Reply: ListParcelsResponseDto }>("/", async (request, reply) => {
    const parcels = await listParcels(fastify.db);
    reply.send(parcels);
  });

  fastify.patch<{ Params: { id: number }; Body: UpdateParcelRequestDto }>("/:id", async (request, reply) => {
    const parcel = await updateParcel(fastify.db, request.params.id, request.body);
    reply.send(parcel);
  });

  fastify.delete<{ Params: { id: number } }>("/:id", async (request, reply) => {
    await deleteParcel(fastify.db, request.params.id);
    reply.send({ message: "Parcel deleted" });
  });

  fastify.get<{ Params: { id: number } }>("/:id/regenerate", async (request, reply) => {
    const parcel = await regenerateParcel(fastify.db, request.params.id);
    reply.send(parcel);
  });

  fastify.get<{ Reply: RefreshParcelsResponseDto }>("/refresh", async (request, reply) => {
    const numCreated = await refreshParcels(fastify.db);
    reply.send({ numCreated });
  });
};
