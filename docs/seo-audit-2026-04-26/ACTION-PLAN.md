# Roy Riff — SEO Action Plan
**Fecha:** 2026-04-26 · **Health Score actual:** 35/100 · **Target post-implementación:** 78–85/100

> Cada acción tiene prioridad, esfuerzo y archivo. Las **CRITICAL** son bloqueantes — sin ellas el resto no rinde.

---

## 🔴 CRITICAL — Esta semana (bloqueantes de indexación)

### C-1. Habilitar rutas SPA faltantes en el plugin
**Esfuerzo:** 5 min · **Impacto:** ALTÍSIMO
**Archivo:** `royriff-app-temp/royriff-app.php` líneas 181-185

Agregar al array `$spa_routes`:
```php
'local',
'galeria',
'comparacion-ebike-royriff',
```
Sin esto, `/local`, `/galeria` y `/bicicletas-electricas/comparacion-ebike-royriff` redirigen 301 al home. Son páginas que ya construimos y nadie puede ver.

### C-2. Capturar TODOS los meta tags del dist/index.html en el shortcode
**Esfuerzo:** 30 min · **Impacto:** ALTÍSIMO
**Archivo:** `royriff-app-temp/royriff-app.php` líneas 74-79

El regex actual solo captura `<link.*\.css>` y `<script.*\.js>`. Cambiar para que también capture:
- `<title>`
- `<meta name="description" ...>`
- `<meta property="og:* ...">`
- `<meta name="twitter:* ...">`
- `<link rel="canonical" ...>`

Y emitirlos vía hook `wp_head`. Sin esto: cero preview en redes, cero meta description visible para Google, cero hreflang.

### C-3. Reemplazar wp-sitemap.xml con sitemap.xml real
**Esfuerzo:** 30 min · **Impacto:** ALTÍSIMO
**Archivos:**
- Crear `frontend/public/sitemap.xml` con las 21 URLs reales (template incluido al final de este plan)
- Subir copia a `public_html/sitemap.xml` del WP server
- Editar `royriff-app-temp/royriff-app.php` para deshabilitar el sitemap auto de WP (`add_filter('wp_sitemaps_enabled', '__return_false')`) o redirigir `/wp-sitemap.xml` → `/sitemap.xml`
- En `robots.txt`, referenciar `/sitemap.xml`
- Submit en Google Search Console + Bing Webmaster Tools

### C-4. Reescribir PoliticaPrivacidad.jsx
**Esfuerzo:** 2-3 h · **Impacto:** ALTO + cumplimiento legal
**Archivo:** `frontend/src/pages/Legal/PoliticaPrivacidad.jsx`

Replicar estructura de `TerminosCondiciones.jsx`. Mínimo cubrir:
- Identificación del responsable (Zohan Venture SAS)
- Datos recolectados (nombre, email, DNI, teléfono, dirección, datos de pago vía MP, datos de navegación)
- Finalidades
- Base legal (Ley 25.326)
- Conservación
- Transferencia (Mercado Pago, paqueterías)
- Derechos del titular (acceso, rectificación, supresión)
- Cookies
- Contacto del responsable de tratamiento

Target: 800-1000 palabras.

### C-5. Title dinámico por ruta SPA
**Esfuerzo:** 1 h · **Impacto:** ALTO
**Archivo:** `royriff-app-temp/royriff-app.php` líneas 27-39

Filter `pre_get_document_title` retorna hoy un literal único. Cambiar por lógica basada en `$_SERVER['REQUEST_URI']`. Mapeo mínimo:

| Ruta | Title |
|---|---|
| `/` | Roy Riff \| Bicicletas Eléctricas Premium en Argentina |
| `/bicicletas-electricas/lola-cruiser` | Roy Riff LOLA \| Urban Cruiser 500W \| Yerba Buena Tucumán |
| `/bicicletas-electricas/xxxx-expedition` | Roy Riff XXXX Expedition \| Fat Tire 500W \| 90km autonomía |
| `/local` | Local Roy Riff Yerba Buena, Tucumán \| Test Ride Bicis Eléctricas |
| `/galeria` | Galería Roy Riff \| Fotos LOLA y XXXX en Argentina |
| `/financiacion` | Financiación Roy Riff \| Cuotas Bicicletas Eléctricas |
| `/test-ride-tucuman` | Test Ride Roy Riff \| Probá LOLA y XXXX en Tucumán |
| `/faq` | Preguntas Frecuentes Roy Riff \| Bicicletas Eléctricas |
| ... | (mismo patrón para el resto) |

### C-6. Subir robots.txt extendido con AI bots
**Esfuerzo:** 15 min · **Impacto:** ALTO
**Archivo:** `public_html/robots.txt` (server WordPress)

Replace con versión que declara explícitamente AI bots permitidos (template incluido al final de este plan).

---

## 🟠 HIGH — Próximas 2 semanas

### H-1. Schema JSON-LD server-side (Organization + LocalBusiness + Product + FAQPage + Person)
**Esfuerzo:** 4-6 h · **Impacto:** ALTÍSIMO (rich results + AI citation)
**Archivo nuevo:** `royriff-app-temp/includes/class-royriff-schema.php`

Crear clase con 2 métodos:
- `output_global_schema()` — emite Organization + WebSite + Person Marcos en TODAS las páginas
- `output_route_schema()` — detecta ruta y emite el específico (Product en /bicicletas-electricas/*, LocalBusiness + FAQPage en /local, FAQPage en /faq)

Hook en `wp_head`. **NO** depender de React Helmet — debe ser server-side para que crawlers sin JS lo vean.

Datos disponibles para schema (extraer de archivos):
- `frontend/src/utils/constants.js` → CONTACT_INFO + COMPANY_INFO + TEAM_MANIFESTO
- `frontend/src/utils/productData.js` → datos completos LOLA y XXXX
- `frontend/src/pages/Home/sections/TestimonialsSection.jsx` → 6 testimonios reales para Reviews

Templates JSON-LD listos para pegar en el plan completo de schema en `/Users/marcosruiz/.claude/plans/flickering-booping-tower-agent-a67710ff22de5e897.md`.

### H-2. Reescribir 4 tutoriales con contenido real
**Esfuerzo:** 8 h (2 h por tutorial) · **Impacto:** ALTO (4 long-tail keywords + dejan de ser thin)
**Archivos:** `frontend/src/pages/Tutoriales/Tutorial{Armado,Bateria,Mantenimiento,Seguridad}.jsx`

Cada uno con:
- H1
- 3-5 secciones (intro, paso a paso, errores frecuentes, FAQ)
- Citas técnicas desde `productData.js` (no inventar)
- Video embed (puede ser unlisted YT) — opcional pero recomendado
- CTA final a WhatsApp + producto

Target: 600-800 palabras por tutorial.

### H-3. Crear página `/sobre-nosotros`
**Esfuerzo:** 2-3 h · **Impacto:** ALTO (E-E-A-T + AI citation)
**Archivo nuevo:** `frontend/src/pages/SobreNosotros/SobreNosotros.jsx`

Reutilizar `TEAM_MANIFESTO` de `constants.js` + extender con:
- Año de fundación
- Equipo (con fotos del local)
- Filosofía de producto
- "Por qué nos elegís"

Target: 500-700 palabras. Linkear desde footer + nav.

### H-4. Ampliar XXXX en productData.js
**Esfuerzo:** 1-2 h · **Impacto:** MEDIO-ALTO (paridad con LOLA)
**Archivo:** `frontend/src/utils/productData.js` bloque `'xxxx-expedition'`

- `storySplit.paragraphs`: hoy 1 párrafo, agregar 2 más (por qué fat tire, perfil del rider, casos de uso reales en Tucumán/montaña)
- `faq`: hoy 5, llevar a 10-12

### H-5. Code-split del bundle React + pre-render
**Esfuerzo:** 4-6 h · **Impacto:** ALTO (CWV + bots de IA que no ejecutan JS)
**Archivo:** `frontend/src/router/AppRouter.jsx` + `frontend/vite.config.js`

- Convertir imports estáticos a `React.lazy(() => import(...))` con `<Suspense>`
- En `vite.config.js` agregar `build.rollupOptions.output.manualChunks` para separar React/router/store del código de páginas
- Configurar `vite-plugin-prerender` o `react-snap` para generar HTML estático por ruta (las 21 URLs del sitemap)

### H-6. Subir llms.txt y llms-full.txt
**Esfuerzo:** 2 h · **Impacto:** MEDIO-ALTO (Claude, Perplexity, ChatGPT)
**Archivos nuevos:**
- `frontend/public/llms.txt` (template completo en sección final de este plan)
- `frontend/public/llms-full.txt` (concatenar specs LOLA + XXXX + FAQ + manifiesto en markdown plano, ~8-15 KB)

Subir copia también a `public_html/llms.txt` y `public_html/llms-full.txt` del WP.

### H-7. Verificar y desbloquear AI bots en WAF
**Esfuerzo:** 30 min · **Impacto:** ALTO (sin esto, robots.txt es letra muerta)
**Acción:** Acceso al panel de Cloudflare/Wordfence/SiteGround Security

Whitelist de UAs:
- GPTBot
- ClaudeBot / anthropic-ai / Claude-Web
- PerplexityBot / Perplexity-User
- OAI-SearchBot / ChatGPT-User
- Google-Extended / GoogleOther
- CCBot
- Bytespider
- DuckAssistBot

Verificar curl con UA "GPTBot" devolvió `PROTOCOL_ERROR` HTTP/2 — sugiere bloqueo activo.

### H-8. Ampliar /faq, /servicio-tecnico-y-garantia, /contacto
**Esfuerzo:** 4 h total · **Impacto:** MEDIO-ALTO
**Archivos:**
- `pages/FAQ/FAQ.jsx` — de 4 a 15-20 preguntas con categorías (Compra, Producto, Envío, Garantía, Mantenimiento, Legal)
- `pages/ServicioGarantia/ServicioGarantia.jsx` — de 80 a 800-1200 palabras (tabla cobertura, proceso, repuestos, FAQ garantía)
- `pages/Contacto/Contacto.jsx` — sumar formulario, horarios, mapa, diferenciar canales

### H-9. Reescribir CTA del hero del home
**Esfuerzo:** 5 min · **Impacto:** MEDIO (anchor SEO + UX)
**Archivo:** `frontend/src/pages/Home/sections/HeroSection.jsx` línea 52

- Cambiar "Haz clic aquí" por "Comparar LOLA y XXXX"
- Agregar trust strip debajo del CTA: "Envío gratis · 2 años de garantía · Test ride en Tucumán"

### H-10. Resolver inconsistencia de pricing
**Esfuerzo:** 30 min · **Impacto:** MEDIO (trust + AI citation)
**Archivos:** `frontend/src/utils/constants.js` + `frontend/src/utils/productData.js`

Decidir cuál es la fuente de verdad. Sugerencia: hacer que `PRODUCTS.LOLA.price` y `PRODUCTS.XXXX.price` se importen desde `PRODUCT_DATA[slug].pricing.efectivo`, o eliminar el campo redundante.

---

## 🟡 MEDIUM — Próximo mes

### M-1. Implementar IndexNow para Bing/Yandex
**Esfuerzo:** 2 h · **Impacto:** MEDIO (frecuencia de crawl)

- Generar key + crear `frontend/public/indexnow-{key}.txt`
- Endpoint en `royriff-app.php` que pingee IndexNow al actualizar posts/páginas
- Hook en `wp_after_insert_post`

### M-2. Self-host Google Fonts + font-display: swap
**Esfuerzo:** 1 h · **Impacto:** MEDIO (CWV / FOUT)
**Archivo:** `frontend/src/index.css` o `frontend/index.html`

Descargar las webfonts (Barlow Semi Condensed) y servirlas desde `frontend/public/fonts/`. Eliminar `@import` de `fonts.googleapis.com`.

### M-3. CSP (Content-Security-Policy) header
**Esfuerzo:** 2 h · **Impacto:** MEDIO (security)
**Archivo:** `royriff-app-temp/royriff-app.php` (líneas 44-55 aprox)

Implementar CSP via `add_action('send_headers', ...)`. Whitelistear: `'self'`, fonts.googleapis.com, fonts.gstatic.com, api.royriff.com.ar, wa.me, maps.google.com, mercadopago.com.

### M-4. Limpiar /shop/, /cart/, /checkout/, /sample-page/, /my-account/ del sitemap
**Esfuerzo:** 30 min · **Impacto:** MEDIO
**Acción:**
- Borrar página `sample-page` desde WP admin
- Sacar `/shop/`, `/cart/`, `/checkout/`, `/my-account/` del sitemap WP (deshabilitar sub-sitemap o redirect a `/carrito/`, `/checkout/` SPA)

### M-5. Limpiar sub-sitemap de users (`/wp-sitemap-users-1.xml`)
**Esfuerzo:** 15 min · **Impacto:** BAJO-MEDIO
**Acción:** `add_filter('wp_sitemaps_users_query_args', '__return_empty_array')` en plugin o functions.php para no exponer `/author/franpl/`.

### M-6. Crear página `/buenos-aires` o `/retiro-palermo`
**Esfuerzo:** 3-4 h · **Impacto:** MEDIO (geo SEO BsAs)
**Archivo nuevo:** `frontend/src/pages/Local/RetiroPalermo.jsx`

Captura tráfico de BsAs. Replicar estructura de /local pero focused en retiro Palermo. Datos de pricing + envío + cómo coordinar.

### M-7. Crear blog con 6-10 posts SEO iniciales
**Esfuerzo:** 30-40 h · **Impacto:** ALTO long-term
**Posts recomendados:**
1. ¿Necesito licencia para una bicicleta eléctrica en Argentina? (Decreto 196/2025 explicado)
2. Bicicleta eléctrica vs nafta: cuánto ahorrás por mes en Argentina (tabla con números reales)
3. Cómo elegir una e-bike en Argentina: guía 2026
4. Mantenimiento de bici eléctrica en clima argentino (humedad, polvo, lluvia)
5. Roy Riff vs otras e-bikes en Argentina (comparación honesta)
6. Reparto en bici eléctrica: ¿conviene la XXXX para delivery?
7. Test ride en Tucumán: cómo es el proceso (replicar Local pero en formato blog)

Cada post: 1500+ palabras, schema BlogPosting, autor Marcos.

### M-8. Auditoría completa de alt text + lazy loading
**Esfuerzo:** 2 h · **Impacto:** MEDIO (accesibilidad + CWV)

Recorrer todas las imágenes:
- Asegurar `alt=` descriptivo en cada `<img>` (especialmente productos)
- Agregar `loading="lazy"` a imágenes below-the-fold
- Implementar `srcSet` responsivo para hero images
- Comprimir `local-09.webp` (>500KB)

---

## 🟢 LOW — Backlog

### L-1. Crear ítem en Wikidata para "Roy Riff (marca)"
**Esfuerzo:** 1 h · **Impacto:** LOW-MEDIUM long-term

### L-2. Subir tutoriales como videos a YouTube
**Esfuerzo:** Producción de video (externa)

### L-3. Activar Reddit/comunidades de e-bikes argentinas
**Esfuerzo:** Marketing recurrente

### L-4. Schema BreadcrumbList en producto + páginas internas
**Esfuerzo:** 1 h

### L-5. Fix cookie `_fbp` con domain `.com.ar`
**Esfuerzo:** 30 min (revisar config Facebook for WooCommerce plugin)

---

## 📋 Templates listos para pegar

### sitemap.xml (subir a `frontend/public/sitemap.xml` y `public_html/sitemap.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.sitemaps.org/schemas/sitemap-image/0.9">

  <url>
    <loc>https://royriff.com.ar/</loc>
    <lastmod>2026-04-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://royriff.com.ar/og-image.webp</image:loc>
      <image:title>Roy Riff - Bicicletas Eléctricas Premium</image:title>
    </image:image>
  </url>

  <!-- Productos (alta prioridad) -->
  <url><loc>https://royriff.com.ar/bicicletas-electricas/lola-cruiser</loc><lastmod>2026-04-26</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>
  <url><loc>https://royriff.com.ar/bicicletas-electricas/xxxx-expedition</loc><lastmod>2026-04-26</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>
  <url><loc>https://royriff.com.ar/bicicletas-electricas/comparacion-ebike-royriff</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>

  <!-- Conversión / showroom -->
  <url><loc>https://royriff.com.ar/test-ride-tucuman</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>
  <url><loc>https://royriff.com.ar/local</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>
  <url><loc>https://royriff.com.ar/contacto</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>
  <url><loc>https://royriff.com.ar/financiacion</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>

  <!-- Confianza / información -->
  <url><loc>https://royriff.com.ar/envios</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>
  <url><loc>https://royriff.com.ar/servicio-tecnico-y-garantia</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>
  <url><loc>https://royriff.com.ar/faq</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>

  <!-- Galería -->
  <url><loc>https://royriff.com.ar/galeria</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.65</priority></url>

  <!-- Tutoriales (oro para AI Overviews) -->
  <url><loc>https://royriff.com.ar/tutoriales</loc><lastmod>2026-04-26</lastmod><changefreq>monthly</changefreq><priority>0.70</priority></url>
  <url><loc>https://royriff.com.ar/tutoriales/armado</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.70</priority></url>
  <url><loc>https://royriff.com.ar/tutoriales/bateria-y-carga</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.70</priority></url>
  <url><loc>https://royriff.com.ar/tutoriales/mantenimiento-basico</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.70</priority></url>
  <url><loc>https://royriff.com.ar/tutoriales/seguridad-antirrobo</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.70</priority></url>

  <!-- Legales -->
  <url><loc>https://royriff.com.ar/terminos-y-condiciones</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.30</priority></url>
  <url><loc>https://royriff.com.ar/politica-de-privacidad</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.30</priority></url>
  <url><loc>https://royriff.com.ar/cambios-y-devoluciones</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.40</priority></url>
  <url><loc>https://royriff.com.ar/boton-de-arrepentimiento</loc><lastmod>2026-04-26</lastmod><changefreq>yearly</changefreq><priority>0.30</priority></url>

</urlset>
```

### robots.txt extendido (subir a `public_html/robots.txt`)

```
# robots.txt — royriff.com.ar
# Última actualización: 2026-04-26

# ============================================
# AI Search Bots — PERMITIDOS
# ============================================

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Amazonbot
Allow: /

# ============================================
# Bloqueos generales
# ============================================

User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-content/uploads/wc-logs/
Disallow: /wp-content/uploads/woocommerce_transient_files/
Disallow: /wp-content/uploads/woocommerce_uploads/
Disallow: /carrito
Disallow: /checkout
Disallow: /my-account
Disallow: /cart/
Disallow: /redireccion-pago
Disallow: /compra-confirmada
Disallow: /pedido-cancelado
Disallow: /seguimiento
Disallow: /*?add-to-cart=*
Disallow: /*?orderby=*
Disallow: /*?filter_*

# Sitemaps
Sitemap: https://royriff.com.ar/sitemap.xml

# llms.txt
# https://royriff.com.ar/llms.txt
```

### llms.txt (subir a `frontend/public/llms.txt` y `public_html/llms.txt`)

```markdown
# Roy Riff

> Roy Riff es una marca argentina de bicicletas eléctricas premium con sede en Yerba Buena, Tucumán. Vende dos modelos: LOLA (urban cruiser) y XXXX Expedition (fat-tire todoterreno). Ambas son legalmente bicicletas con pedaleo asistido (EPAC) bajo el Decreto 196/2025 — no requieren patente, registro ni seguro obligatorio. Operada por Zohan Venture SAS (CUIT 33-71884288-9).

Nota sobre el modelo XXXX: "XXXX Expedition" es el nombre oficial del modelo fat-tire de Roy Riff, no es un placeholder ni un campo de censura. Referenciar siempre como "Roy Riff XXXX" o "XXXX Expedition".

## Empresa

- [Sobre Roy Riff y el equipo](https://royriff.com.ar/local): manifiesto del fundador Marcos, historia de la marca, fotos del local físico en Yerba Buena.
- [Contacto y showroom](https://royriff.com.ar/contacto): WhatsApp +54 381 200-6514, email postventa@royriff.com.ar, dirección Av. Aconquija 1727, Yerba Buena, Tucumán.
- [Test ride en Tucumán](https://royriff.com.ar/test-ride-tucuman): turnos para probar LOLA y XXXX en el local.

## Productos

- [LOLA - Urban Cruiser E-Bike](https://royriff.com.ar/bicicletas-electricas/lola-cruiser): bicicleta eléctrica urbana estilo cruiser. Motor 500W (65 N.m), batería 48V 10.4Ah extraíble, autonomía 40-65 km, frenos hidráulicos, neumáticos 26"x3.0", display LCD con USB, peso 32 kg. Precio efectivo ARS 2.000.000.
- [XXXX Expedition - Fat Tire E-Bike](https://royriff.com.ar/bicicletas-electricas/xxxx-expedition): bicicleta eléctrica fat-tire de expedición. Motor 500W, batería 48V 20Ah (960Wh), autonomía 70-90 km, doble suspensión, neumáticos 20"x4.0", peso 42 kg. Precio efectivo ARS 2.700.000.
- [Comparador LOLA vs XXXX](https://royriff.com.ar/bicicletas-electricas/comparacion-ebike-royriff): tabla comparativa de ambos modelos.

## Información legal y técnica

- [Marco legal Decreto 196/2025](https://royriff.com.ar/faq): ambas bicicletas cumplen con la normativa argentina EPAC (motor ≤500W, asistencia limitada a 25 km/h en vía pública). No requieren patente, licencia ni seguro obligatorio.
- [Garantía y servicio técnico](https://royriff.com.ar/servicio-tecnico-y-garantia): 2 años en cuadro, 1 año en componentes eléctricos (motor, batería, controller, display).
- [Envíos a todo el país](https://royriff.com.ar/envios): paquetería nacional 3-6 días hábiles, bici llega pre-ensamblada al 85-90%.
- [Financiación y medios de pago](https://royriff.com.ar/financiacion): hasta 12 cuotas vía Mercado Pago.
- [FAQ general](https://royriff.com.ar/faq): preguntas frecuentes sobre legalidad, autonomía, lluvia, batería, repuestos.

## Tutoriales

- [Armado de la bici al recibirla](https://royriff.com.ar/tutoriales/armado)
- [Carga y cuidado de la batería](https://royriff.com.ar/tutoriales/bateria-y-carga)
- [Mantenimiento básico](https://royriff.com.ar/tutoriales/mantenimiento-basico)
- [Seguridad y antirrobo](https://royriff.com.ar/tutoriales/seguridad-antirrobo)

## Legal

- [Términos y condiciones](https://royriff.com.ar/terminos-y-condiciones)
- [Política de privacidad](https://royriff.com.ar/politica-de-privacidad)
- [Cambios y devoluciones](https://royriff.com.ar/cambios-y-devoluciones)
- [Botón de arrepentimiento](https://royriff.com.ar/boton-de-arrepentimiento)

## Optional

- [Galería de fotos del local](https://royriff.com.ar/galeria)
- [Manifiesto del fundador Marcos](https://royriff.com.ar/local#manifiesto)
```

---

## 🎯 Roadmap consolidado

### Sprint 1 — Bloqueantes (esta semana)
**Objetivo:** que el sitio sea indexable. Score esperado: 35 → 55

- [ ] C-1: Whitelist `/local`, `/galeria`, `/comparacion-ebike-royriff` en plugin
- [ ] C-2: Capturar todos los meta del dist/index.html
- [ ] C-3: Subir sitemap.xml con 21 URLs reales + submit en GSC
- [ ] C-4: Reescribir PoliticaPrivacidad.jsx
- [ ] C-5: Title dinámico por ruta
- [ ] C-6: robots.txt extendido + AI bots
- [ ] H-7: Verificar/desbloquear AI bots en WAF

### Sprint 2 — Schema + contenido (semanas 2-3)
**Objetivo:** habilitar rich results + AI citation. Score esperado: 55 → 72

- [ ] H-1: JSON-LD server-side (Organization + LocalBusiness + Product + FAQPage + Person)
- [ ] H-2: 4 tutoriales con contenido real
- [ ] H-3: Página /sobre-nosotros
- [ ] H-4: Ampliar XXXX en productData
- [ ] H-6: llms.txt + llms-full.txt
- [ ] H-8: Ampliar /faq, /servicio-tecnico-y-garantia, /contacto
- [ ] H-9: CTA del hero + trust strip
- [ ] H-10: Resolver inconsistencia pricing

### Sprint 3 — Performance + AI (semanas 4-5)
**Objetivo:** CWV verde + GEO score >50. Score esperado: 72 → 82

- [ ] H-5: Code-split + pre-render
- [ ] M-2: Self-host fonts
- [ ] M-1: IndexNow
- [ ] M-3: CSP header
- [ ] M-8: Audit alt text + lazy loading

### Sprint 4 — Long-term (mes 2+)
- [ ] M-6: Página /buenos-aires
- [ ] M-7: Blog con 6-10 posts SEO
- [ ] L-1: Wikidata
- [ ] L-2: YouTube videos

---

## ✅ Verificación post-implementación

Tras cada sprint:

1. **Crawlability**
   - [ ] `curl -I https://royriff.com.ar/local` → **200** (no 301)
   - [ ] `curl https://royriff.com.ar/sitemap.xml` → 21 URLs reales
   - [ ] Submit en Google Search Console → "URLs descubiertas: 21"

2. **HTML head**
   - [ ] `curl https://royriff.com.ar/` debería incluir: `<meta name="description">`, `<meta property="og:image">`, `<meta property="og:title">`, `<link rel="canonical">`, `<script type="application/ld+json">` (Organization + WebSite)

3. **Schema validation**
   - [ ] [Schema.org Validator](https://validator.schema.org/) → 0 errores en home, /local, /faq, productos
   - [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) → eligible para Product, LocalBusiness

4. **AI bots**
   - [ ] `curl -A "GPTBot" -I https://royriff.com.ar/` → 200 (no PROTOCOL_ERROR)
   - [ ] `curl https://royriff.com.ar/llms.txt` → contenido válido
   - [ ] `curl https://royriff.com.ar/robots.txt` → AI bots declarados

5. **Performance**
   - [ ] [PageSpeed Insights mobile](https://pagespeed.web.dev/) → LCP <2.5s, CLS <0.1, INP <200ms
   - [ ] Bundle inicial <300 KB (post code-split)

6. **Search visibility (después de 2-4 semanas)**
   - [ ] Google → site:royriff.com.ar → debería listar las 21 URLs
   - [ ] Search Console Coverage → 0 errores, todas indexadas
   - [ ] Test query: "bicicleta eléctrica yerba buena tucumán" → Roy Riff aparece

---

## 📍 Notas finales

- Los specialists generaron planes detallados en `/Users/marcosruiz/.claude/plans/flickering-booping-tower-agent-*.md` con código JSON-LD listo para pegar y refactores línea por línea. Acudir a esos archivos cuando se ejecute cada sprint.
- Score post-implementación realista: **78–85/100** después de Sprint 1 + 2 + 3.
- Score >90 requiere blog activo + entity building externo (Sprint 4 + marketing).
