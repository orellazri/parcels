import * as schema from "@/db/schema";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: NodePgDatabase<typeof schema>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  const db = drizzle({ connection: process.env.DATABASE_URL!, casing: "snake_case", schema });

  fastify.decorate("db", db);
});
