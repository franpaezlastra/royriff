/**
 * Copia frontend/dist al plugin royriff-app-temp/dist
 * para que WordPress sirva la SPA con la estructura correcta (index.html + assets/*.js, assets/*.css).
 * Ejecutar después de "npm run build" o usar "npm run build:plugin".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const frontendDir = path.join(__dirname, '..');
const srcDir = path.join(frontendDir, 'dist');
const pluginDistDir = path.join(frontendDir, '..', 'royriff-app-temp', 'dist');

if (!fs.existsSync(srcDir)) {
  console.error('No existe frontend/dist. Ejecutá primero: npm run build');
  process.exit(1);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyRecursive(srcDir, pluginDistDir);
console.log('Plugin dist actualizado en royriff-app-temp/dist');
