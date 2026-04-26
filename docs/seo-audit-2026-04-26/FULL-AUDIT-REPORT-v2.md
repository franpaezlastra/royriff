# Roy Riff — SEO Audit v2 (post-deploy Sesión 10)
**Fecha:** 2026-04-26 · **Versión:** 2 (post-deploy) · **Build deployado:** `index-D8S0Go9o.js` + `index-BMbc0Gps.css` (Sesión 10)

> Este reporte verifica el estado del sitio en vivo después de subir el deploy zip de Sesión 10. Para el reporte original con todos los detalles ver [`FULL-AUDIT-REPORT.md`](./FULL-AUDIT-REPORT.md).

---

## 🎯 SEO Health Score: **37 / 100** (era 35)

**Mejora real con el deploy: +2 puntos**

¿Por qué tan poco? El deploy actualizó el contenido visible para usuarios con navegador (testimonios reales, copy de financiación legal, /local, /galeria, etc.) pero **no resolvió ninguno de los issues técnicos críticos** (whitelist plugin, meta tags descartados, sitemap, schema). Los crawlers de Google y bots de IA siguen viendo lo mismo: HTML mínimo de WordPress sin metas ni schema.

---

## ✅ Verificación post-deploy

### Build correcto desplegado
```
index-D8S0Go9o.js  ✅  (coincide con commit 264964c local)
index-BMbc0Gps.css ✅
```

### Status codes URLs SPA
| URL | Status | Resultado |
|---|---|---|
| `/` | 200 | ✅ |
| `/bicicletas-electricas/lola-cruiser` | 301→/lola-cruiser/ → 200 | ✅ |
| `/bicicletas-electricas/xxxx-expedition` | 301→200 | ✅ |
| `/bicicletas-electricas/comparacion-ebike-royriff` | 301→200 | ✅ |
| `/test-ride-tucuman` | 301→200 | ✅ |
| `/financiacion`, `/envios`, `/faq`, `/contacto` | 301→200 | ✅ |
| `/tutoriales/*` (4 sub-rutas) | 301→200 | ✅ |
| `/terminos-y-condiciones`, `/cambios-y-devoluciones`, `/boton-de-arrepentimiento`, `/politica-de-privacidad` | 301→200 | ✅ |
| **`/local`** | **301 → `/`** | ❌ **BUG** — redirige al home |
| **`/galeria`** | **301 → `/`** | ❌ **BUG** — redirige al home |

### HTML head servido (crawlers sin JS)
```
✅ <title>Roy Riff | Bicicletas Eléctricas Premium en Argentina</title>
✅ <link rel="canonical" href="https://royriff.com.ar/" />
✅ <meta name="viewport" ... />
❌ <meta name="description"> — AUSENTE
❌ <meta property="og:*"> — AUSENTES (12 tags faltantes)
❌ <meta name="twitter:*"> — AUSENTES
❌ <script type="application/ld+json"> — AUSENTE (cero schema)
❌ <link rel="alternate" hreflang> — AUSENTE
```

### Tamaño HTML inicial — confirmación de SSR/prerender ausente
**Todas las URLs sirven exactamente 57,614 bytes** del mismo HTML genérico de WordPress:
```
57614 bytes  /
57614 bytes  /politica-de-privacidad/
57614 bytes  /tutoriales/armado/
57614 bytes  /faq/
57614 bytes  /bicicletas-electricas/lola-cruiser/
57614 bytes  /test-ride-tucuman/
```

**Implicación crítica:** para Googlebot (que renderiza JS pero con cola de 2-3 días) y especialmente para crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, que NO renderizan JS), todas las páginas son indistinguibles. El contenido vive en JSX y se monta con React.

### Sitemap
```
6 sub-sitemaps WP (sin cambio)
1 URL en wp-sitemap-posts-page-1.xml (solo /sample-page/, sin cambio)
```

---

## 📊 Delta vs audit v1

### Lo que el deploy SÍ mejoró (visible en navegadores con JS)
| Aspecto | v1 | v2 |
|---|---|---|
| Páginas existentes en código y servidas | Solo viejas | Todas (incluido /local, /galeria que existen aunque rotas en routing) |
| Testimonios | Placeholders genéricos (Martín García, Luciana Fernández, Diego Romero) | 6 reales con foto (Héctor, Ariel, Federico, Agustín, Matías, Patricia) |
| Copy de financiación | "Hasta 12 cuotas sin interés" (ilegal) | Cumple Ley 22.802 con tabla de recargos + CFT |
| /local | No existía | Existe en código pero ROTA por whitelist plugin |
| /galeria | No existía | Existe con 60 fotos pero ROTA por whitelist plugin |
| Productos LOLA/XXXX | Specs viejas | Specs detalladas + 11 FAQs (LOLA) |
| Hero copy | Igual | Igual ("Haz clic aquí" sigue) |
| Páginas legales | Solo Términos básico | Términos + Cambios + Botón Arrepentimiento completos. Privacidad sigue vacía. |
| Build size | (sin medir) | 720 KB JS bundle único |

### Lo que el deploy NO resolvió (todos los críticos del audit v1)
| # | Issue crítico | Estado v1 | Estado v2 |
|---|---|---|---|
| 1 | `/local`, `/galeria` redirect 301 al home | ❌ | ❌ **persiste** — whitelist plugin sin tocar |
| 2 | Sitemap inservible (6 URLs, todas redirects al home) | ❌ | ❌ **persiste** |
| 3 | HTML head sin meta description, og:*, JSON-LD | ❌ | ❌ **persiste** — shortcode descarta metas |
| 4 | Title duplicado en 100% rutas SPA | ❌ | ❌ **persiste** — filter `pre_get_document_title` sin tocar |
| 5 | `PoliticaPrivacidad.jsx` vacía | ❌ 5 palabras | ❌ **persiste** sigue 5 palabras |
| 6 | 4 tutoriales placeholder duplicados | ❌ ~40 palabras c/u | ❌ **persiste** |
| 7 | "Haz clic aquí" hero | ❌ | ❌ **persiste** |
| 8 | Pricing inconsistency LOLA `3.300.000` vs `2.000.000` | ❌ | ❌ **persiste** |
| 9 | Sin llms.txt, robots.txt extendido, schema, sitemap real | ❌ | ❌ **persiste** |

### Lo que SÍ se confirmó nuevo
- **Una mayoría de URLs SPA funcionan correctamente** con trailing slash (productos, tutoriales, legales, financiación, etc.) — antes no estaba 100% claro porque estaban en ruta old.
- **Confirmado: solo `/local` y `/galeria` están rotas** (no estaban en whitelist) — el resto del SPA está en whitelist `bicicletas-electricas`, `financiacion`, `envios`, etc.
- **Confirmado: SPA sin prerender, todo el HTML inicial idéntico** — confirma diagnóstico v1 sobre SSR.

---

## 🚨 Top 5 críticos (sin cambios desde v1)

1. **Whitelist plugin** — agregar `'local'`, `'galeria'`, `'comparacion-ebike-royriff'` al array `$spa_routes` en `royriff-app-temp/royriff-app.php:181-185`. **Fix de 5 minutos.**
2. **Sitemap real** — crear `frontend/public/sitemap.xml` con las 21 URLs reales y subir a `public_html/sitemap.xml`. Submit en GSC. Template listo en [`ACTION-PLAN.md`](./ACTION-PLAN.md).
3. **HTML head sin metas/schema** — fix en `royriff-app-temp/royriff-app.php` líneas 74-79 (regex que descarta) + crear `royriff-app-temp/includes/class-royriff-schema.php` para emitir JSON-LD.
4. **Title duplicado** — filter `pre_get_document_title` (líneas 27-39) hardcodea string único. Mapear por ruta.
5. **`PoliticaPrivacidad.jsx`** + 4 tutoriales placeholder + "Haz clic aquí" — content fixes que no requieren plugin.

---

## 📈 Scoring por categoría — v2

| Categoría | v1 | v2 | Delta |
|---|---|---|---|
| Technical SEO | 42 | 42 | 0 |
| Content Quality | 62 | 65 | +3 (testimonios reales + copy financiación legal) |
| On-Page SEO | 25 | 25 | 0 |
| Schema / Structured Data | 8 | 8 | 0 |
| Performance (CWV) | 35 | 35 | 0 |
| Images | 60 | 65 | +5 (las nuevas webp del deploy son livianas) |
| AI Search Readiness (GEO) | 22 | 22 | 0 |
| **TOTAL** | **35** | **37** | **+2** |

---

## 🎯 Conclusión

El deploy fue **necesario pero no suficiente**. Resolvió la divergencia entre código local y producción para usuarios humanos con navegador, pero NO movió la aguja para SEO/AI search. Los problemas críticos son **ingeniería del plugin PHP + content fixes**, todos accionables en el [`ACTION-PLAN.md`](./ACTION-PLAN.md) original.

**Próximo paso recomendado**: ejecutar Sprint 1 del action plan. Tiempo total estimado: 4-5 horas. Score esperado post-Sprint 1: **55-60**.

---

## ⚙️ Detalles técnicos verificados

### Comando ejecutado para HTML head
```bash
curl -sL https://royriff.com.ar/ -A "Mozilla/5.0" | grep -iE "<meta (name|property)|<title>|application/ld\+json|canonical"
```

### Comando ejecutado para status codes
```bash
for url in "/" "/local" "/galeria" "/bicicletas-electricas/lola-cruiser" ...; do
  curl -sIL -o /dev/null -w "%{http_code}|%{url_effective}" "https://royriff.com.ar${url}"
done
```

### Confirmación del deploy
```bash
curl -sL https://royriff.com.ar/ | grep -oE "index-[A-Za-z0-9_-]+\.(js|css)"
# index-BMbc0Gps.css
# index-D8S0Go9o.js
```
Coincide con el build local de Sesión 10 (commit `264964c`).
