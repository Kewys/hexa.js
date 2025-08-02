import fs from "fs";
import { exec } from "child_process";
import path from "path";
import archiver from "archiver";
import util from "util";

// Configuración
const tempDir = "temp_node_modules";
const layerRoot = "layer_content";
const zipFile = "dependencies.zip";

const execPromise = util.promisify(exec);

// Leer dependencias de package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const dependencies = packageJson.dependencies || {};

if (Object.keys(dependencies).length === 0) {
  console.error("No hay dependencias encontradas en package.json.");
  process.exit(1);
}

// Limpiar directorios anteriores
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
if (fs.existsSync(layerRoot)) fs.rmSync(layerRoot, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

// Crear nuevo package.json solo con dependencias
fs.writeFileSync(
  path.join(tempDir, "package.json"),
  JSON.stringify({ dependencies }, null, 2)
);

// Instalar dependencias usando pnpm
console.log("Instalando dependencias con npm...");
try {
  await execPromise("npm install --prod", { cwd: tempDir });
} catch (error) {
  console.error("Error al instalar dependencias:", error);
  process.exit(1);
}

// Crear estructura nodejs/node_modules
const layerNodejsPath = path.join(layerRoot, "nodejs");
fs.mkdirSync(layerNodejsPath, { recursive: true });

// Copiar node_modules a layer/nodejs/
fs.cpSync(
  path.join(tempDir, "node_modules"),
  path.join(layerNodejsPath, "node_modules"),
  {
    recursive: true,
  }
);

// Crear el archivo ZIP
console.log("Comprimiendo dependencias en formato AWS Lambda Layer...");
const output = fs.createWriteStream(zipFile);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(
    `✅ Archivo ${zipFile} creado con éxito. Tamaño: ${archive.pointer()} bytes.`
  );
  // Limpieza opcional
  fs.rmSync(tempDir, { recursive: true });
  fs.rmSync(layerRoot, { recursive: true });
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(layerRoot + "/", false); // añade "nodejs/" como raíz en el ZIP
await archive.finalize();
