# Cómo agregar fotos al sitio Roy Riff

Workflow estándar para sumar fotos de eventos, sesiones de producto, vida de marca, clientes o del local — sin pensar en código de más.

## TL;DR — los 5 pasos

```
1. Drop fotos crudas (HEIC/JPG/PNG) en  incoming/<categoria>/
2. npm run photos
3. Pegar las líneas que imprime → editar TÍTULO/CAPTION en galleryData.js
4. cd frontend && npm run build:plugin
5. git push  +  subir zip a SiteGround
```

---

## 1. Categorías disponibles

Cada categoría tiene una carpeta drop-in y un destino fijo. **Elegí bien la categoría** — define dónde aparece la foto en el sitio.

| Categoría | Drop-in | Destino | Aparece en |
|---|---|---|---|
| `productos` | `incoming/productos/` | `frontend/src/assets/galeria/productos/` | /galeria → filtro Productos |
| `vida` | `incoming/vida/` | `frontend/src/assets/galeria/vida/` | /galeria → filtro Vida Roy Riff |
| `eventos` | `incoming/eventos/` | `frontend/src/assets/galeria/eventos/` | /galeria → filtro Eventos |
| `clientes` | `incoming/clientes/` | `frontend/src/assets/testimonios/` | /galeria → filtro Clientes (también disponible para testimonios del home) |
| `local` | `incoming/local/` | `frontend/src/assets/local/` | /local → masonry "Nuestro local" |

## 2. Drop fotos crudas

- Formatos aceptados: **HEIC** (iPhone), JPG, JPEG, PNG, TIFF, BMP
- Cualquier resolución y peso — el script las optimiza
- Cualquier nombre de archivo — el script renombra
- Sin orden particular — se procesan en orden alfabético

Ejemplo:

```
incoming/eventos/
   IMG_4523.HEIC
   IMG_4527.HEIC
   foto-grupal.jpg
```

## 3. Procesar con un comando

Desde la raíz del repo:

```bash
npm run photos
```

Qué hace internamente:
- HEIC → JPG via `sips` (macOS built-in, sin instalar nada)
- Resize a max **1600px** lado mayor (no agranda si ya es chica)
- Convierte a **WebP quality 82** (balance ideal entre peso y calidad)
- Respeta orientación EXIF (rotate)
- Renombra con prefijo + número correlativo (no pisa archivos existentes)
- Mueve al destino de la categoría
- Imprime los snippets para pegar en `galleryData.js` o `localData.js`

Output esperado:

```
📂 eventos: 3 fotos
   ✓ IMG_4523.HEIC → evt-19.webp  (1600×1200, 187KB)
   ✓ IMG_4527.HEIC → evt-20.webp  (1600×1200, 192KB)
   ✓ foto-grupal.jpg → evt-21.webp  (1600×1067, 142KB)

════════════════════════════════════════════════════════════════
📋 PEGÁ ESTO EN frontend/src/pages/Galeria/galleryData.js
════════════════════════════════════════════════════════════════

// 1) IMPORTS — agregalos junto a los demás imports al inicio:

import evtNew19 from '../../assets/galeria/eventos/evt-19.webp';
import evtNew20 from '../../assets/galeria/eventos/evt-20.webp';
import evtNew21 from '../../assets/galeria/eventos/evt-21.webp';

// 2) ENTRIES — agregalos al final del array GALLERY_ITEMS:

  { id: 'evt-new-19', type: 'image', src: evtNew19, category: 'eventos', title: 'TÍTULO', caption: 'CAPTION OPCIONAL' },
  ...
```

## 4. Pegar en el data file

Abrí `frontend/src/pages/Galeria/galleryData.js` (o `frontend/src/pages/Local/localData.js` si fue categoría `local`):

1. **Imports** → arriba, junto a los demás `import xxxx from '...'`
2. **Entries** → al final del array `GALLERY_ITEMS`, antes del `]`
3. **Editar `'TÍTULO'` y `'CAPTION OPCIONAL'`** con copy real:
   - **Título** corto, ej: "Inauguración del local — diciembre 2026"
   - **Caption** opcional, ej: "Familia, amigos y clientes"

Si la foto no necesita caption, podés borrar el campo `caption` directamente.

## 5. Build + commit + deploy

```bash
cd frontend
npm run build:plugin

cd ..
git add .
git commit -m "fotos: <descripción corta del lote>"
git push origin main
```

Después, generar el zip de deploy y subirlo a SiteGround:

```bash
cd royriff-app-temp
zip -r ~/Desktop/royriff-deploy.zip . -x "*.DS_Store"
```

En SiteGround File Manager:
1. `/public_html/wp-content/plugins/royriff-app/` → upload zip → extract
2. Limpiar `dist/assets/index-*.js` y `index-*.css` viejos (mantener solo los nuevos hash)
3. Site Tools → Speed → Caching → Flush Cache

## 6. Limpiar el drop-in

El script **no borra** las fotos crudas en `incoming/`. Cuando confirmés que todo se ve bien en producción, borrá vos los archivos de `incoming/<categoria>/` para que el próximo lote esté limpio.

```bash
rm -rf incoming/eventos/*
```

## Performance — por qué no se ralentiza el sitio

- **WebP q82** → 70-80% más liviano que JPG con la misma percepción visual
- **Max 1600px** → suficiente para retina mobile y desktop, descarta exceso
- **Lazy loading** → componentes de galería cargan solo lo visible
- **Code-splitting de Vite** → el bundle no crece linealmente con cada foto
- **CDN de SiteGround** → cachea las imágenes en edge

Promedio actual: 100-300 KB por foto. 21 fotos en /galeria suman ~4 MB total — irrelevante.

## Errores comunes

| Error | Causa | Fix |
|---|---|---|
| "Carpeta drop-in no existe" | Primera vez que corrés `npm run photos` | El script la crea sola — solo dropea fotos y volvé a correr |
| "No hay fotos para procesar" | `incoming/<cat>/` está vacío | Verificá que dropeaste en la subcarpeta correcta |
| "sips: command not found" | No estás en macOS | El script de HEIC usa sips (built-in macOS). En Linux/Windows hay que adaptar |
| Imagen sale rotada en el sitio | EXIF orientation rara | El script usa `sharp.rotate()` que respeta EXIF — debería estar OK. Si pasa, abrí la foto en Vista previa, exportala y volvé a procesar |
| Nuevo bundle JS no aparece en el live | Caché del navegador o de SiteGround | Ctrl+Shift+R + Site Tools → Speed → Flush Cache |

## Decisión de diseño

**Por qué NO se autogenera todo el array:** el campo `title` y `caption` de cada foto son contenido editorial. Si lo automatizamos, perdés control sobre cómo se presenta cada imagen al usuario. El script asiste el 90% del trabajo (conversión, optimización, renombrado, snippets) y vos editás los textos finales — el 10% que importa para SEO y experiencia.
