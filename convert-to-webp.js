const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

// Carpeta principal
const folderPath = "C:\\Users\\NEW GAME\\Desktop\\TodoFran\\RoyRiff - copia\\Bicis";

// Extensiones que quieres convertir
const imageExtensions = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif"];

// Función para recorrer carpetas y subcarpetas
async function convertFolder(folder) {
  const files = await fs.readdir(folder);

  for (const file of files) {
    const fullPath = path.join(folder, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // Si es carpeta, llamar recursivamente
      await convertFolder(fullPath);
    } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
      // Si es imagen, convertir a WebP
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

// Ejecutar
convertFolder(folderPath)
  .then(() => console.log("¡Conversión completa!"))
  .catch(err => console.error(err));
