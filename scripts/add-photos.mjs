#!/usr/bin/env node
/**
 * Roy Riff — Add Photos
 *
 * Procesa fotos crudas (HEIC/JPG/PNG) de la carpeta `incoming/<categoria>/`,
 * las convierte a WebP optimizado (max 1600px, quality 82), las renombra
 * con prefijo + índice, y las mueve al destino correcto del frontend.
 *
 * Al final imprime los snippets de imports + entries para pegar en
 * galleryData.js o localData.js.
 *
 * Uso:
 *   node scripts/add-photos.mjs
 *   npm run photos
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const INCOMING = path.join(ROOT, 'incoming');

const CATEGORIES = {
  productos: {
    out: path.join(ROOT, 'frontend/src/assets/galeria/productos'),
    target: 'gallery',
    importPrefix: 'prodNew',
    idPrefix: 'prod-new',
    fileBase: 'prod',
  },
  vida: {
    out: path.join(ROOT, 'frontend/src/assets/galeria/vida'),
    target: 'gallery',
    importPrefix: 'vidaNew',
    idPrefix: 'vida-new',
    fileBase: 'vida',
  },
  eventos: {
    out: path.join(ROOT, 'frontend/src/assets/galeria/eventos'),
    target: 'gallery',
    importPrefix: 'evtNew',
    idPrefix: 'evt-new',
    fileBase: 'evt',
  },
  clientes: {
    out: path.join(ROOT, 'frontend/src/assets/testimonios'),
    target: 'gallery',
    importPrefix: 'cliNew',
    idPrefix: 'cli-new',
    fileBase: 'cli',
  },
  local: {
    out: path.join(ROOT, 'frontend/src/assets/local'),
    target: 'local',
    importPrefix: 'localNew',
    idPrefix: 'local',
    fileBase: 'local',
  },
};

const VALID_EXTS = ['.heic', '.HEIC', '.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.tiff', '.bmp'];

const MAX_DIMENSION = 1600;
const QUALITY = 82;

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function nextIndex(dir, base) {
  const files = await fs.readdir(dir).catch(() => []);
  const re = new RegExp(`^${base}-(\\d{2,3})\\.webp$`);
  let max = 0;
  for (const f of files) {
    const m = f.match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

async function processCategory(name, config) {
  const incomingDir = path.join(INCOMING, name);
  if (!await exists(incomingDir)) return [];

  const files = (await fs.readdir(incomingDir))
    .filter(f => VALID_EXTS.includes(path.extname(f)));

  if (files.length === 0) return [];

  await fs.mkdir(config.out, { recursive: true });
  let idx = await nextIndex(config.out, config.fileBase);

  console.log(`\n📂 ${name}: ${files.length} fotos`);

  const generated = [];

  for (const file of files) {
    const fullPath = path.join(incomingDir, file);
    const ext = path.extname(file).toLowerCase();
    const newName = `${config.fileBase}-${String(idx).padStart(2, '0')}.webp`;
    const outPath = path.join(config.out, newName);

    try {
      let inputPath = fullPath;
      let tmpPath = null;

      // HEIC → JPG con sips (macOS built-in)
      if (ext === '.heic') {
        tmpPath = path.join(incomingDir, `__tmp_${Date.now()}.jpg`);
        execSync(`sips -s format jpeg "${fullPath}" --out "${tmpPath}"`, { stdio: 'pipe' });
        inputPath = tmpPath;
      }

      // Resize + webp con sharp
      const info = await sharp(inputPath)
        .rotate() // respeta EXIF orientation
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      if (tmpPath) await fs.unlink(tmpPath).catch(() => {});

      const sizeKB = Math.round((await fs.stat(outPath)).size / 1024);
      console.log(`   ✓ ${file} → ${newName}  (${info.width}×${info.height}, ${sizeKB}KB)`);

      generated.push({
        cat: name,
        target: config.target,
        importName: `${config.importPrefix}${String(idx).padStart(2, '0')}`,
        importPath: name === 'clientes'
          ? `../../assets/testimonios/${newName}`
          : name === 'local'
            ? `../../assets/local/${newName}`
            : `../../assets/galeria/${name}/${newName}`,
        id: `${config.idPrefix}-${String(idx).padStart(2, '0')}`,
        category: name === 'local' ? null : name,
        width: info.width,
        height: info.height,
      });

      idx++;
    } catch (err) {
      console.error(`   ✗ Error con ${file}: ${err.message}`);
    }
  }

  return generated;
}

async function main() {
  console.log('🖼  Roy Riff — Add Photos\n');

  // Si no existe la carpeta incoming, crearla con las subcarpetas y salir
  if (!await exists(INCOMING)) {
    await fs.mkdir(INCOMING, { recursive: true });
    for (const cat of Object.keys(CATEGORIES)) {
      await fs.mkdir(path.join(INCOMING, cat), { recursive: true });
    }
    console.log(`📁 Carpeta drop-in creada en: ${INCOMING}\n`);
    console.log('Subcarpetas listas para usar:');
    for (const cat of Object.keys(CATEGORIES)) {
      console.log(`   incoming/${cat}/`);
    }
    console.log('\nDropeá fotos en la subcarpeta correcta y volvé a correr `npm run photos`.');
    return;
  }

  const allGenerated = [];
  for (const [name, config] of Object.entries(CATEGORIES)) {
    const result = await processCategory(name, config);
    allGenerated.push(...result);
  }

  if (allGenerated.length === 0) {
    console.log('\nℹ️  No hay fotos para procesar en `incoming/<categoria>/`.\n');
    console.log('   Subcarpetas disponibles:', Object.keys(CATEGORIES).join(', '));
    return;
  }

  // Imprimir snippets
  const galleryItems = allGenerated.filter(i => i.target === 'gallery');
  const localItems = allGenerated.filter(i => i.target === 'local');

  if (galleryItems.length > 0) {
    console.log('\n' + '═'.repeat(64));
    console.log('📋 PEGÁ ESTO EN frontend/src/pages/Galeria/galleryData.js');
    console.log('═'.repeat(64));

    console.log('\n// 1) IMPORTS — agregalos junto a los demás imports al inicio:\n');
    for (const item of galleryItems) {
      console.log(`import ${item.importName} from '${item.importPath}';`);
    }

    console.log('\n// 2) ENTRIES — agregalos al final del array GALLERY_ITEMS:\n');
    for (const item of galleryItems) {
      console.log(`  { id: '${item.id}', type: 'image', src: ${item.importName}, category: '${item.category}', title: 'TÍTULO', caption: 'CAPTION OPCIONAL' },`);
    }
    console.log('\n   ⚠️  Editá los TÍTULO y CAPTION antes de hacer commit.');
  }

  if (localItems.length > 0) {
    console.log('\n' + '═'.repeat(64));
    console.log('📋 PEGÁ ESTO EN frontend/src/pages/Local/localData.js');
    console.log('═'.repeat(64));

    console.log('\n// IMPORTS:\n');
    for (const item of localItems) {
      console.log(`import ${item.importName} from '${item.importPath}';`);
    }

    console.log('\n// ENTRIES — agregar al array de imágenes del local:\n');
    for (const item of localItems) {
      console.log(`  { id: '${item.id}', src: ${item.importName}, alt: 'Local Roy Riff' },`);
    }
  }

  console.log('\n' + '═'.repeat(64));
  console.log('🚀 PRÓXIMOS PASOS:');
  console.log('═'.repeat(64));
  console.log('  1. Editar el data file con TÍTULO y CAPTION');
  console.log('  2. cd frontend && npm run build:plugin');
  console.log('  3. git add . && git commit -m "fotos: <descripción>" && git push');
  console.log('  4. Regenerar zip: cd royriff-app-temp && zip -r ~/Desktop/royriff-deploy.zip . -x "*.DS_Store"');
  console.log('  5. Subir zip a SiteGround File Manager → /public_html/wp-content/plugins/royriff-app/');
  console.log('  6. Limpiar bundles viejos en dist/assets/ (index-XXX.js viejos)');
  console.log('  7. Flush cache de SiteGround');
  console.log('\n💡 Las fotos crudas en `incoming/` quedaron sin tocar — borralas vos cuando confirmes.\n');
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
