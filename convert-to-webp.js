const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

// Uso:
//   node convert-to-webp.js [carpeta]
// Default: ./Bicis (relativo al directorio actual).
const folderArg = process.argv[2] || "./Bicis";
const folderPath = path.resolve(folderArg);

// Extensiones a convertir
const imageExtensions = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"];

async function convertFolder(folder) {
  const files = await fs.readdir(folder);

  for (const file of files) {
    const fullPath = path.join(folder, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await convertFolder(fullPath);
    } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
      const newFilePath = path.join(folder, path.parse(file).name + ".webp");
      try {
        await sharp(fullPath)
          .webp({ quality: 90 })
          .toFile(newFilePath);
        console.log(`Convertido: ${fullPath} → ${newFilePath}`);
      } catch (err) {
        console.error(`Error al convertir ${fullPath}:`, err);
      }
    }
  }
}

(async () => {
  if (!(await fs.pathExists(folderPath))) {
    console.error(`No se encontró la carpeta: ${folderPath}`);
    process.exit(1);
  }
  console.log(`Procesando: ${folderPath}`);
  await convertFolder(folderPath);
  console.log("¡Conversión completa!");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
