import { GetCreditsResponseDto } from "@parcels/common";
import { FastifyInstance } from "fastify";

export const creditsRoutes = (fastify: FastifyInstance) => {
  fastify.get<{ Reply: GetCreditsResponseDto }>("/", async (request, reply) => {
    const response = await fetch("https://openrouter.ai/api/v1/credits", {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });
    const { data } = (await response.json()) as { data: { total_credits: number; total_usage: number } };

    reply.send({
      totalCredits: data.total_credits,
      totalUsage: data.total_usage,
    });
  });
};
