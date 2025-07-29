import fs from "node:fs/promises";
import Fastify from "fastify";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Pre-cargar el HTML si estamos en producción
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Crear instancia de Fastify
const app = Fastify();

// 🔧 Registrar el plugin que permite usar middlewares estilo Express
await app.register((await import("@fastify/middie")).default);

// Configuración de Vite para desarrollo o producción
/** @type {import('vite').ViteDevServer | undefined} */
let vite;

if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Ruta catch-all para SSR
app.all("*", async (request, reply) => {
  try {
    const url = request.raw.originalUrl.replace(base, "");

    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("./src/entry-server.jsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(url);

    const html = template
      .replace("<!--app-head-->", rendered.head ?? "")
      .replace("<!--app-html-->", rendered.html ?? "");

    reply.code(200).headers({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace?.(e);
    console.error(e.stack);
    reply.status(500).send(e.stack);
  }
});

// Iniciar el servidor
app.listen({ port }, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
