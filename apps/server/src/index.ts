import fastifyStatic from "@fastify/static";
import { CronJob } from "cron";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import fastify from "fastify";
import path from "path";
import { db } from "./db/db";
import { creditsRoutes } from "./routes/credits";
import { parcelsRoutes } from "./routes/parcels";
import { refreshParcels } from "./services/parcels";

async function main() {
  try {
    console.info("Migrating database");
    await migrate(db, { migrationsFolder: path.join(__dirname, "..", "drizzle") });
  } catch (error) {
    console.error("Error migrating database", error);
    process.exit(1);
  }

  const server = fastify();

  // React SPA
  server.register(fastifyStatic, { root: path.join(__dirname, "..", "web") });

  // API
  server.register(parcelsRoutes, { prefix: "/api/parcels" });
  server.register(creditsRoutes, { prefix: "/api/credits" });

  // Healthcheck
  server.get("/api/health", async (request, reply) => {
    return reply.status(200).send({ status: "ok" });
  });

  // Refresh parcels in the background
  new CronJob(
    process.env.REFRESH_PARCELS_CRON ?? "0 0 */3 * * *",
    async function () {
      console.log("Refreshing parcels...");
      try {
        const numCreated = await refreshParcels();
        console.log(`Refreshed parcels. Created ${numCreated} parcels`);
      } catch (error) {
        console.error("Error refreshing parcels", error);
      }
    }, // onTick
    null, // onComplete
    true, // start
    process.env.TIMEZONE ?? "UTC", // timeZone
    null, // context
    process.env.ENV !== "development", // runOnInit
    null, // utcOffset
    null, // unrefTimeout
    true, // waitForCompletion
  );

  server.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
