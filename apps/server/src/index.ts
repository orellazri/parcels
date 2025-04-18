import { default as dbPlugin, drizzleDb } from "@/plugins/db";
import { creditsRoutes } from "@/routes/credits";
import { parcelsRoutes } from "@/routes/parcels";
import { refreshParcels } from "@/services/parcels";
import { CronJob } from "cron";
import fastify from "fastify";

const server = fastify();

server.register(dbPlugin);

server.register(parcelsRoutes, { prefix: "/api/parcels" });
server.register(creditsRoutes, { prefix: "/api/credits" });

server.get("/health", async (request, reply) => {
  return reply.status(200).send({ status: "ok" });
});

// Refresh parcels in the background
new CronJob(
  process.env.REFRESH_PARCELS_CRON ?? "0 0 */3 * * *",
  async function () {
    console.log("Refreshing parcels...");
    try {
      const numCreated = await refreshParcels(drizzleDb);
      console.log(`Refreshed parcels. Created ${numCreated} parcels`);
    } catch (error) {
      console.error("Error refreshing parcels", error);
    }
  }, // onTick
  null, // onComplete
  true, // start
  process.env.TIMEZONE ?? "UTC", // timeZone
  null, // context
  true, // runOnInit
  null, // utcOffset
  null, // unrefTimeout
  true, // waitForCompletion
);

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
