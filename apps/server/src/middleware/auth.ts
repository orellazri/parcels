import { FastifyReply, FastifyRequest } from "fastify";
import { getConfig } from "../config/config";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Missing Authorization header",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid Authorization format. Use 'Bearer YOUR_PASSWORD'",
    });
  }

  const password = authHeader.slice(7); // Remove "Bearer " prefix
  if (password !== getConfig().webPassword) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid password",
    });
  }
}
