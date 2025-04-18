import dbPlugin from "@/plugins/db";
import { creditsRoutes } from "@/routes/credits";
import { parcelsRoutes } from "@/routes/parcels";
import fastify from "fastify";

const server = fastify();

server.register(dbPlugin);

server.register(parcelsRoutes, { prefix: "/api/parcels" });
server.register(creditsRoutes, { prefix: "/api/credits" });

server.get("/health", async (request, reply) => {
  return reply.status(200).send({ status: "ok" });
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
