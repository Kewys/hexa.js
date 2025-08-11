import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // importante si tu bucket está sirviendo desde la raíz
  build: {
    outDir: "dist/client",
    assetsDir: "assets",
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
