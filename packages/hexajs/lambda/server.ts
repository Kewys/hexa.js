import fastify from "fastify";
import fs from "fs";
import path from "path";
import { render } from "../src/entry-server";

const distPath = path.join(__dirname, "../client");
const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

// Cambia esto a la URL real de tu bucket S3
const s3BaseUrl = "https://hexajs.s3.amazonaws.com";

const app = fastify();

app.get("/*", async (req, reply) => {
  const url = req.url;
  const { html } = render(url);

  const finalHtml = template
    .replace("<!--app-html-->", html)
    .replace(/(src|href)=["'](\/[^"']+)["']/g, (match, attr, path) => {
      return `${attr}="${s3BaseUrl}${path}"`;
    });

  reply.type("text/html").send(finalHtml);
});

export default app;
