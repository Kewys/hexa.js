import Fastify from "fastify";

const server = Fastify();

// Ruta raíz simple
server.get("/", async (request, reply) => {
  return { message: "Servidor Fastify activo en / 🚀" };
});

// Iniciar el servidor
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor corriendo en ${address}`);
});
