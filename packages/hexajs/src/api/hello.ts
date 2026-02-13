import type { FastifyInstance } from "fastify";

export default async function helloRoute(fastify: FastifyInstance) {
  fastify.get("/api/hello", async (_, reply) => {
    return { message: "Hola desde la API!" };
  });
}
