import { GetCreditsResponseDto } from "@parcels/common";
import { FastifyInstance } from "fastify";
import { getConfig } from "../config/config";

export const creditsRoutes = (fastify: FastifyInstance) => {
  fastify.get<{ Reply: GetCreditsResponseDto }>("/", async (request, reply) => {
    const response = await fetch("https://openrouter.ai/api/v1/credits", {
      headers: {
        Authorization: `Bearer ${getConfig().openRouterApiKey}`,
      },
    });
    const { data } = (await response.json()) as { data: { total_credits: number; total_usage: number } };

    reply.send({
      totalCredits: data.total_credits,
      totalUsage: data.total_usage,
    });
  });
};
