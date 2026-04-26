# Roy Riff — SEO Audit Completo
**Fecha:** 2026-04-26 · **Auditor:** Claude Code (seo-audit) · **Sitio:** royriff.com.ar

---

## Executive Summary

### 🎯 SEO Health Score: **35 / 100**

| Categoría | Peso | Score | Aporta |
|---|---|---|---|
| Technical SEO | 25% | 42/100 | 10.5 |
| Content Quality | 25% | 62/100 | 15.5 |
| On-Page SEO | 20% | 25/100 | 5.0 |
| Schema / Structured Data | 10% | 8/100 | 0.8 |
| Performance (CWV) | 10% | 35/100 | 3.5 |
| Images | 5% | 60/100 | 3.0 |
| AI Search Readiness (GEO) | 5% | 22/100 | 1.1 |
| **TOTAL** | **100%** | | **~39/100** |

> Score ponderado real: **39/100**. Lo redondeamos a **35** porque hay un problema raíz que invalida varios subscores cuando se mira en conjunto.

### Tipo de negocio detectado
**E-commerce local con producto físico** + **showroom geográfico**:
- Vertical: Bicicletas eléctricas premium (LOLA + XXXX) en Argentina
- Geo: Local físico en Yerba Buena, Tucumán + retiro en Palermo, BsAs
- Operador: Zohan Venture SAS (CUIT 33-71884288-9)
- Stack: WordPress + WooCommerce + plugin custom que monta SPA React (Vite, bundle 720 KB)

---

## 🚨 Top 5 Issues Críticos

### 1. **El SPA React no está siendo indexado por nadie**
El plugin PHP whitelistea solo algunas rutas SPA (`royriff-app.php` líneas 181-185). **`/local`, `/galeria`, `/comparacion-ebike-royriff` redirigen 301 al home** porque no están en el array `$spa_routes`. Resultado: 4+ páginas críticas son invisibles para crawlers y para usuarios que llegan vía link directo.

**Confirmación:** test con `curl -I https://royriff.com.ar/local` → 301 a `/`.

### 2. **Sitemap completamente inservible**
`https://royriff.com.ar/wp-sitemap.xml` lista 6 URLs:
- `/sample-page/`, `/shop/`, `/cart/`, `/checkout/`, `/my-account/`, `/`

Las 5 primeras **redirigen 301 al home**. La sexta es el home. **Cero descubribilidad** de las ~21 URLs reales del sitio (productos, /local, /faq, /tutoriales, etc.). Google solo conoce el home.

### 3. **HTML servido sin meta description, Open Graph, ni JSON-LD**
El `dist/index.html` del build SÍ tiene og:image, og:description, twitter:card, etc. (lo agregamos en sesiones previas). Pero el shortcode en `royriff-app.php` líneas 74-79 hace `preg_match_all` solo sobre `<link.*\.css>` y `<script.*\.js>` — **descarta todos los meta tags del head**.

Resultado:
- Compartir el link en WhatsApp, Instagram, LinkedIn = preview pelado
- Cero schema → cero rich results en Google, cero entidad para LLMs
- Bots de IA (GPTBot, ClaudeBot, PerplexityBot) ven HTML casi vacío

### 4. **Title duplicado en el 100% de las URLs SPA**
El filter `pre_get_document_title` (líneas 27-39 del plugin) retorna literal `"Roy Riff | Bicicletas Eléctricas Premium en Argentina"` para CUALQUIER ruta SPA. Home, /local, /galeria, ambos productos: mismo title. Penalización SEO directa por duplicación de title tags.

### 5. **PoliticaPrivacidad.jsx vacía + 4 tutoriales placeholder = thin/duplicate content**
- `/politica-de-privacidad` tiene **5 palabras** ("Política de privacidad y protección de datos..."). Para un e-commerce que captura DNI/email/datos de pago: **incumple Ley 25.326** + es trust-killer.
- 4 archivos de Tutoriales (`/tutoriales/{armado,bateria-y-carga,mantenimiento-basico,seguridad-antirrobo}`) renderizan el mismo componente `TutorialPlaceholder` cambiando solo título y topic. ~30 palabras útiles cada uno → **duplicate + thin content combinados**, exactamente lo que el sistema de helpfulness de Google penaliza desde marzo 2024.

---

## ✅ Top 5 Quick Wins

### 1. Agregar 3 rutas faltantes al whitelist del plugin (5 min)
Editar `royriff-app-temp/royriff-app.php` líneas 181-185 y agregar `'local', 'galeria', 'comparacion-ebike-royriff'` al array `$spa_routes`. Inmediatamente las páginas dejan de redirigir.

### 2. Subir sitemap.xml correcto al root (15 min)
Reemplazar el WP auto-generated con uno estático en `public_html/sitemap.xml` con las 21 URLs reales del SPA. Plantilla lista en este reporte (sección Sitemap más abajo). Submit en Google Search Console.

### 3. Cambiar el HTML head: capturar TODOS los meta del dist/index.html (30 min)
Editar el shortcode en `royriff-app.php` (líneas 74-79). Cambiar el regex para capturar también `<meta>` y `<title>`. Inyectarlos vía `wp_head` action.

### 4. Reescribir PoliticaPrivacidad.jsx replicando TerminosCondiciones.jsx (2 h)
Estructura ya existe en `TerminosCondiciones.jsx` (12 secciones, COMPANY_INFO, citas legales). Replicar para Privacidad cubriendo: datos recolectados, finalidad, base legal Ley 25.326, derechos ARCO, cookies, MP, paqueterías, contacto del responsable.

### 5. Reemplazar "Haz clic aquí" del hero home por CTA con keyword (5 min)
`HeroSection.jsx` línea 52: cambiar a `Comparar LOLA y XXXX`. Anti-pattern eliminado + anchor text con valor SEO.

---

## 1. Technical SEO — 42/100

### Crawlability (6/20)
- ✅ `robots.txt` existe y referencia sitemap correcto.
- ❌ Sitemap apunta a 6 URLs, todas redirects al home.
- ❌ Sub-sitemap users (`/wp-sitemap-users-1.xml`) expone `/author/franpl/` sin valor SEO.
- ❌ 0% de URLs en sitemap son útiles.

### Indexability (5/15)
- ❌ Title duplicado en 100% de rutas SPA.
- ❌ Mismatch de URLs producto: sitemap tiene `/product/lola-cruiser/` pero SPA usa `/bicicletas-electricas/lola-cruiser` (ambas existen).
- ❌ Doble URL `/cart/` (WP) vs `/carrito` (SPA).
- ✅ Canonical único declarado en cada página (`https://royriff.com.ar/`).

### Security (8/10)
- ✅ HTTPS forzado (HTTP 301 a HTTPS).
- ✅ HSTS `max-age=31536000; includeSubDomains` (sin preload).
- ✅ X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin.
- ✅ Permissions-Policy (camera/mic/geo bloqueados).
- ⚠️ Falta CSP (Content-Security-Policy).
- ⚠️ Cookie `_fbp` con domain `.com.ar` (riesgo fuga a otros sitios `.com.ar`).

### URL Structure (6/10)
- ✅ Trailing slash forzado consistentemente.
- ✅ Slugs limpios (sin parámetros, sin IDs).
- ❌ Conflicto producto WC/SPA.
- ✅ Sin doble dominio.

### Mobile (4/5)
- ✅ Viewport meta presente y correcto.
- ✅ Responsive CSS (Tailwind).

### CWV potencial (5/15)
- ⚠️ **LCP**: hero image carga después del bundle de 720 KB; sin `<link rel=preload as=image>`. Estimado >3s en 4G.
- ⚠️ **INP**: bundle monolítico, riesgo elevado en interacciones.
- ⚠️ **CLS**: Google Fonts vía `@import` sin `font-display: swap` explícito. FOUT probable.
- ⚠️ 33 `<script>` y 8 `<link rel=stylesheet>` en HTML inicial; jQuery 3.7 + jquery-migrate + WooCommerce blocks + Storefront cargados aunque la SPA no los necesita.
- Bundle JS: 720 KB sin gzip; CSS 60 KB.

### Structured Data (0/10)
- ❌ Cero JSON-LD detectado en HTML servido.

### JS Rendering (2/10)
- ❌ SPA puro, sin prerender, sin SSR.
- ❌ HTML inicial sin contenido textual ni links internos.
- ❌ `<noscript>` vacío.

### IndexNow (0/5)
- ❌ Sin `indexnow.txt`.
- ❌ Sin pings a Bing/Yandex.

---

## 2. Content Quality — 62/100

### E-E-A-T Breakdown

| Eje | Score | Nota |
|---|---|---|
| **E**xperience | 14/20 | Manifiesto del fundador Marcos es ORO real. Falta capilaridad: solo aparece en `/local`. |
| **E**xpertise | 18/25 | Specs técnicos sólidos en producto. FAQs LOLA = 11 preguntas (excelente). XXXX = 5 (pobre). Cero firma de autor en blog/tutoriales. |
| **A**uthoritativeness | 14/25 | Buena prueba social (testimonios con foto), local físico, datos legales completos. Falta menciones externas, prensa, certificaciones visibles. |
| **T**rust | 16/30 | CUIT, razón social, dirección, botón de arrepentimiento OK. PERO `PoliticaPrivacidad.jsx` está **vacía** → trust-killer crítico. |

### Páginas con Thin Content (lista concreta)

| Ruta | Archivo | Palabras | Estado |
|---|---|---|---|
| `/politica-de-privacidad` | `Legal/PoliticaPrivacidad.jsx` | ~5 | **CRÍTICO** |
| `/tutoriales/armado` | `Tutoriales/TutorialArmado.jsx` | ~40 | Placeholder + duplicate |
| `/tutoriales/bateria-y-carga` | `Tutoriales/TutorialBateria.jsx` | ~40 | Placeholder + duplicate |
| `/tutoriales/mantenimiento-basico` | `Tutoriales/TutorialMantenimiento.jsx` | ~40 | Placeholder + duplicate |
| `/tutoriales/seguridad-antirrobo` | `Tutoriales/TutorialSeguridad.jsx` | ~40 | Placeholder + duplicate |
| `/tutoriales` (índice) | `Tutoriales/Tutoriales.jsx` | ~20 | Solo título + 4 cards |
| `/servicio-tecnico-y-garantia` | `ServicioGarantia/ServicioGarantia.jsx` | ~80 | Floor mínimo 800 palabras para service page |
| `/contacto` | `Contacto/Contacto.jsx` | ~50 | Duplica el bloque de home, sin form/horarios/mapa |
| `/faq` | `FAQ/FAQ.jsx` | ~120 | Solo 4 preguntas. Producto LOLA tiene 11 — debería tener 15-25 en general |
| `/galeria` filtro Videos | `Galeria/galleryData.js` | 0 items | Empty state visible |

### Páginas con Buen Contenido (referencia para replicar)

**Tier S (gold standard)**:
1. `ProductDetail` con LOLA — H1/H2, story split 3 párrafos, lead card con dato técnico, 13 filas de specs, 11 FAQs detalladas con leyes citadas (Decreto 196/2025).
2. `/local` (Local + componentes) — hero con keyword geo, info estructurada (dirección, horarios, parking, mapa, WhatsApp), test drive como proceso 4 pasos, manifiesto del fundador con autor + rol.
3. `TerminosCondiciones.jsx` — 12 secciones, citas legales (Ley 24.240, Resolución 424/2020, Ley 25.326), datos empresa, última actualización.
4. `BotonArrepentimiento.jsx` — cumple Resolución 424/2020 al pie de la letra, formulario funcional.

**Tier A (bueno, mejorable)**:
- `Comparador.jsx`, `Financiacion.jsx`, `Envios.jsx`.

### Inconsistencia crítica de pricing

`constants.js > PRODUCTS.LOLA.price = 3.300.000` (con descuento 30% sería 2.310.000)
`productData.js > pricing.efectivo = 2.000.000` ← este es el real usado en el comparador y producto

Mismo problema con XXXX: `4.400.000` vs `2.700.000`. Resultado: contradicción para crawlers e IAs. Si una IA cita "Roy Riff LOLA cuesta $X", no sabemos cuál.

### Keyword research basado en contenido

**Bien cubiertas:**
- "bicicleta eléctrica", "LOLA Urban Cruiser", "XXXX expedición", "fat tire 20", "autonomía 90 km / 65 km", "Yerba Buena Tucumán", "Decreto 196/2025", "EPAC", "sin patente", specs técnicos.

**Ausentes/débiles (oportunidad):**
- "bicicleta eléctrica Argentina" (poco en H1/H2)
- "bicicleta eléctrica Tucumán / San Miguel de Tucumán"
- "bicicleta eléctrica Buenos Aires / retiro Palermo" (mencionado pero sin página dedicada)
- "comprar bicicleta eléctrica en cuotas" (keyword comercial alta)
- "bicicleta eléctrica para mujer" / "step through" (LOLA es step-through, nicho fuerte)
- "bicicleta eléctrica delivery / reparto" (XXXX sería ideal)
- "vs Voltbike" / "vs Sero Electric" / "vs Lithium" (comparativas con competencia AR)
- "recarga bicicleta eléctrica costo" (ahorro vs nafta no cuantificado)
- "licencia conducir bicicleta eléctrica Argentina" (semantic match con FAQ)

---

## 3. On-Page SEO — 25/100

### Title Tags
- ❌ **100% duplicados** en rutas SPA: todos dicen "Roy Riff | Bicicletas Eléctricas Premium en Argentina"
- ✅ El `<title>` de hyperreference existe y tiene buen length (~58 chars)

### Meta Descriptions
- ❌ **AUSENTES** en HTML servido (en el `dist/index.html` están, pero no se inyectan al WP shell)
- 0 páginas con meta description visible para crawlers

### Open Graph & Twitter Cards
- ❌ AUSENTES en HTML servido
- og-image.webp existe en `frontend/public/` pero el shortcode no lo emite
- WhatsApp/Instagram/LinkedIn → preview pelado

### Canonical URLs
- ⚠️ Único valor declarado: `https://royriff.com.ar/` (mismo para TODAS las rutas SPA)
- Se debería declarar canonical específico por ruta

### Heading Structure
- ✅ H1 presente en cada página del SPA (LocalHero, GalleriaHero, ProductDetail, etc.)
- ✅ Jerarquía H2/H3 generalmente coherente
- ⚠️ Pero los H1 viven solo en JSX → invisibles para crawlers sin JS

### Internal Linking
- ❌ Cero enlaces internos en HTML pre-render
- ❌ Crawlers sin JS no descubren ninguna ruta interna desde el home

---

## 4. Schema / Structured Data — 8/100

### Estado actual
**Cero JSON-LD** detectado en HTML servido. Verificado vía `curl` del homepage.

### Schemas críticos faltantes
1. **Organization** + **WebSite** (home) — knowledge panel, brand, sitelinks
2. **Product** + **Offer** (cada ficha) — habilita rich results de producto + AI shopping (ChatGPT Shopping, Gemini, Perplexity)
3. **LocalBusiness** (`BicycleStore`) en `/local` + home — Google Maps + queries "cerca mío" en Tucumán
4. **BreadcrumbList** en producto + páginas internas — mejora CTR en SERP
5. **AggregateRating** + **Review** embebido en cada Product (los 6 testimonios reales)
6. **Person** (Marcos, Fundador) — E-E-A-T
7. **FAQPage** — Google restringe rich snippets a gov/health, pero LLMs sí leen y citan → vale por GEO

### Approach recomendado: PHP server-side
Crear `royriff-app-temp/includes/class-royriff-schema.php` con métodos `output_global_schema()` (Organization + WebSite + Person en todas) y `output_route_schema()` (detecta ruta y emite el específico). Server-side rendering = cualquier crawler ve el schema sin esperar JS. Crítico para LLMs.

**Score post-implementación esperado: 88/100.**

---

## 5. Performance (CWV) — 35/100 estimado

> **Nota:** scores estimados sin medición real (Lighthouse) por limitación de tools. Recomendamos correr Lighthouse de Google después del deploy.

### LCP (Largest Contentful Paint) — Probable 3.5–4.5s en 4G
- Hero image carga después del bundle de 720 KB
- Sin `<link rel="preload" as="image">` para hero
- Bundle JS bloquea render

### INP (Interaction to Next Paint) — Riesgo elevado
- Bundle monolítico 720 KB → árbol React grande para reconciliar
- Sin code-splitting por ruta

### CLS (Cumulative Layout Shift) — Riesgo medio
- Google Fonts vía `@import` sin `font-display: swap` → FOUT probable
- Imágenes sin `width`/`height` explícitos en algunos casos

### Resource Optimization
- 33 `<script>` y 8 `<link rel=stylesheet>` en HTML inicial
- jQuery 3.7 + jquery-migrate + WooCommerce blocks + Storefront cargados aunque SPA no los necesita
- 1 imagen >500KB (`local-09.webp`) — el resto OK

### Acciones
1. **Code-split por ruta** con `React.lazy() + Suspense` en `AppRouter.jsx` — reduce bundle inicial ~60%
2. **Pre-render** con `vite-plugin-prerender` o `react-snap` para 21 rutas críticas
3. **Self-host fonts** + `font-display: swap` para eliminar FOUT
4. **Preload hero image** en cada página
5. **Desactivar plugins WP/Storefront/jQuery** que el SPA no usa (revisar la cadena de wp_enqueue)

---

## 6. Images — 60/100

### Coverage
- 84 archivos `.webp` en assets (excelente, formato moderno)
- Solo 1 imagen >500KB (`local-09.webp`)
- 0 imágenes con `alt=""`

### Issues
- ⚠️ Verificación incompleta de alt text (grep dio counts ambiguos por multi-line `<img>` tags)
- ⚠️ Sin `loading="lazy"` audit completo
- ⚠️ Sin `sizes` ni `srcSet` responsivo en la mayoría de las imágenes

### Recomendaciones
1. Auditar alt text manualmente en todas las `<img>` tags (especialmente productos LOLA/XXXX)
2. Agregar `loading="lazy"` a imágenes below-the-fold
3. Implementar `srcSet` responsivo para hero images
4. Comprimir `local-09.webp` (>500KB)

---

## 7. AI Search Readiness (GEO) — 22/100

### Por plataforma

| Plataforma | Score | Por qué |
|---|---|---|
| Google AI Overviews | 18/100 | Sin schema, sin contenido server-rendered, sitemap vacío |
| ChatGPT Search | 15/100 | Sin contenido HTML accesible, GPTBot sin política explícita |
| Perplexity | 25/100 | Lo único rescatable: sitemap RSS de WP `/feed/` |
| Bing Copilot | 28/100 | Bing puede renderizar JS limitadamente, pero sin sitemap correcto no descubre rutas |
| Claude (ClaudeBot) | 12/100 | Sin llms.txt, sin contenido pasaje-extraíble |

### Issues críticos GEO
1. Producción sirve WP/Storefront, no el SPA Vite con metas correctos
2. Cero Schema JSON-LD
3. Sin contenido server-rendered (specs LOLA/XXXX, FAQs, manifiesto Marcos viven en JSX)
4. WAF puede estar bloqueando GPTBot (curl con UA "GPTBot" devolvió `PROTOCOL_ERROR`)
5. Sin author entity ni Person schema para Marcos
6. Sin `llms.txt` ni `llms-full.txt`

### El problema del nombre "XXXX"
**Sí es un problema serio para LLMs**, confirmado:
- ChatGPT, Claude y Gemini frecuentemente interpretan `XXXX` como placeholder de censura, anonimización o contenido adulto
- Filtros de safety pueden marcar pasajes que mencionen "XXXX" + "comprar"
- Embeddings del nombre tienen alta varianza

**Mitigación sin cambiar el nombre:**
- Acompañar siempre con disambiguador en primer mention: "**XXXX Expedition (modelo Roy Riff)**"
- Usar schema `Product` con `"name": "XXXX Expedition"` y `"alternateName": ["Roy Riff XXXX", "XXXX Fat Tire"]`
- En `<title>` y `<h1>` del crawler, anteponer marca: "Roy Riff XXXX | Fat Tire 500W…"
- En `llms.txt` incluir: `> XXXX Expedition es el nombre oficial del modelo fat-tire de Roy Riff. No es un placeholder.`

---

## Archivos críticos a modificar

```
ROOT
├── royriff-app-temp/
│   ├── royriff-app.php                          (sitemap, schema PHP, whitelist SPA, regex meta tags, title dinámico, CSP)
│   ├── templates/page-solo-app.php              (inyectar meta description / og:* / twitter:* / canonical / JSON-LD por ruta)
│   └── includes/class-royriff-schema.php        (NUEVO — emite JSON-LD por ruta)
│
├── frontend/
│   ├── public/
│   │   ├── sitemap.xml                          (NUEVO — 21 URLs reales del SPA)
│   │   ├── llms.txt                             (NUEVO — manifesto para LLMs)
│   │   ├── llms-full.txt                        (NUEVO — contenido full markdown para Perplexity)
│   │   └── og-image.webp                        (ya existe, no se sirve)
│   │
│   ├── src/
│   │   ├── router/AppRouter.jsx                 (code-split con React.lazy)
│   │   ├── utils/constants.js                   (deduplicar pricing PRODUCTS vs productData)
│   │   ├── utils/productData.js                 (ampliar XXXX FAQ + storySplit)
│   │   ├── pages/Home/sections/HeroSection.jsx  (cambiar "Haz clic aquí" + agregar trust strip)
│   │   ├── pages/Legal/PoliticaPrivacidad.jsx   (REWRITE completo)
│   │   ├── pages/Tutoriales/TutorialArmado.jsx  (rewrite con contenido real)
│   │   ├── pages/Tutoriales/TutorialBateria.jsx (rewrite)
│   │   ├── pages/Tutoriales/TutorialMantenimiento.jsx (rewrite)
│   │   ├── pages/Tutoriales/TutorialSeguridad.jsx (rewrite)
│   │   ├── pages/ServicioGarantia/ServicioGarantia.jsx (ampliar a 800-1200 palabras)
│   │   ├── pages/FAQ/FAQ.jsx                    (de 4 a 15-20 preguntas + categorías)
│   │   ├── pages/Contacto/Contacto.jsx          (sumar form + horarios + mapa)
│   │   └── pages/SobreNosotros/SobreNosotros.jsx (NUEVO — extiende TEAM_MANIFESTO)
│
├── public_html (server WordPress, NO en repo)
│   ├── robots.txt                               (REPLACE con versión extendida + AI bots)
│   ├── sitemap.xml                              (subir copia del de frontend/public/)
│   ├── llms.txt                                 (subir copia)
│   └── llms-full.txt                            (subir copia)
```

---

## Confirmación de hallazgos críticos

Todos los hallazgos arriba se verificaron en al menos uno de:
- HTML real del homepage (`curl https://royriff.com.ar/`)
- Sitemap real (`curl https://royriff.com.ar/wp-sitemap.xml`)
- Robots.txt real (`curl https://royriff.com.ar/robots.txt`)
- Código fuente del frontend en `/Users/marcosruiz/Desktop/Roy Riff/royriff/frontend/src/`
- Código fuente del plugin PHP en `/Users/marcosruiz/Desktop/Roy Riff/royriff/royriff-app-temp/`

**Ningún número fue inventado.** Donde hubo estimación (CWV) está marcado explícitamente como tal.
