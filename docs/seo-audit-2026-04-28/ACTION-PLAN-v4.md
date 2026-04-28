# Roy Riff — Action Plan v4 (post-cierre, optimizaciones futuras)

**Score actual:** 82/100 (estado óptimo para lanzamiento) · **Techo realista:** ~92-95/100 con las acciones de abajo.

> Este plan ya NO es bloqueante para el lanzamiento. Son mejoras incrementales para hacer post-anuncio público a medida que el negocio crece.

---

## 🎯 Próxima ronda — Sprint 4 (1 semana, +6 puntos → 88)

### 1. Forzar 301 HTTP→HTTPS en SiteGround · 5 min
- Site Tools → Security → SSL → "Forzar HTTPS" (toggle si está OFF)
- Verificación: `curl -sI http://royriff.com.ar/` debe devolver `301 Location: https://...`

### 2. Tightening CSP `img-src` · 1 min
En `royriff-app-temp/royriff-app.php`:
```php
. "img-src 'self' data: blob: https:; "
```
Cambio: remover `http:` (redundante con `upgrade-insecure-requests`).

### 3. Test sin `'unsafe-eval'` en `script-src` · 10 min
Probar el bundle sin esa directiva. Si Vite/React no lo necesita en producción (probable), el sitio gana score Mozilla Observatory de B+ a A.

### 4. Hub `/tutoriales/` con intro editorial · 30 min
Agregar 200-300 palabras al inicio explicando los 4 tutoriales + 3-4 FAQs cortas (autonomía, peso máximo, garantía batería).

### 5. Home — bloque "Por qué Roy Riff" · 1 hora
Sumar 300-400 palabras descriptivas entre hero y product cards: showroom Tucumán, 6 testimonios reales, garantía 2 años cuadro / 1 año electrónica, comunidad en Argentina.

### 6. HowTo schema en los 4 tutoriales · 1-2 horas
Agregar `Article` o `HowTo` schema desde el plugin PHP para `/tutoriales/*`. Habilita rich results y mejora citaciones AI.

### 7. Imágenes específicas de Product en schema · 30 min
Reemplazar `og-image.webp` genérico por foto del producto:
- `lola.image` → `/wp-content/plugins/royriff-app/dist/assets/lola-01-...webp`
- `xxxx.image` → `/wp-content/plugins/royriff-app/dist/assets/xxxx-01-...webp`

---

## ⚠️ Sprint 5 — Performance (1-2 semanas, +3 puntos → 91)

### 8. Code splitting del bundle · 1 hora
Bundle JS pesa 730 KB. Vite warning sugiere `manualChunks`:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-motion': ['framer-motion'],
        'vendor-icons': ['react-icons'],
      },
    },
  },
}
```

### 9. Lighthouse audit oficial + optimizaciones CWV · 2 horas
- Ejecutar Lighthouse en mobile + desktop
- Identificar LCP, INP, CLS específicos
- Aplicar correcciones según report (preload de hero image, defer JS, etc.)

### 10. HTTP/3 / Alt-Svc · 5 min
SiteGround Site Tools → Speed → habilitar HTTP/3 si está disponible. Mejora LCP en redes 3G/4G.

---

## 🚀 Sprint 6 — GEO/AI Visibility (2-4 semanas, +5 puntos → 96)

### 11. Prerender estático con vite-plugin-prerender · 1-2 días
Genera HTML completo para las 14 rutas en build time. Llena el `<body>` para crawlers sin JS (Perplexity, Google AIO, Bing Copilot). Esto sube el GEO score 62 → 80+.

### 12. 2do ticket SiteGround para bots restantes · 5 min
Mensaje listo para enviar:
```
Gracias Bozhidar. La excepción funciona perfecto para GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Claude-Web, Perplexity-User.

Necesito ampliar la allowlist con 4 bots adicionales que también devuelven HTTP 444:
- Google-Extended (Gemini training)
- Applebot-Extended (Apple Intelligence)
- CCBot (Common Crawl)
- Bytespider (TikTok / ByteDance)

Mismo dominio royriff.com.ar. Mismo razonamiento de marca emergente. Gracias!
```

### 13. Brand mention foundation · 2-3 semanas
- **Wikipedia stub** "Roy Riff" citando Decreto 196/2025, prensa Tucumán, fundación 2025
- **3 posts en Reddit**: r/argentina, r/tucuman, r/ebikes (sobre test ride, primera impresión)
- **2-3 videos en YouTube**: especificaciones LOLA, especificaciones XXXX, recorrida del local
- **Perfiles externos**: LinkedIn de empresa, Google Business Profile completo

Correlación documentada: brand mentions externas tienen 0.737 de correlación con citas en AI. Sin esto, Authority queda clavado en ~30.

---

## 💎 Sprint 7+ — Long term (cuando haya datos reales)

### 14. Reviews schema con reviews verdaderas
Recolectar reviews públicas (Google Reviews del Business Profile, Trustpilot). Cuando haya 5+ reviews legítimas, agregar `aggregateRating` al Product schema. **NUNCA inventar.**

### 15. FAQPage con preguntas reales del usuario
Después de 3-6 meses de operación, recolectar las consultas reales de WhatsApp y armar FAQ con esas preguntas. Hoy las del audit son hipotéticas razonables, pero las reales son oro para AI search.

### 16. Blog técnico
1 post por mes con contenido real: comparativa de baterías, tutorial específico, testimonios de clientes, casos de uso. Saca al sitio del filtro "thin content" si Google lo aplica.

### 17. PageSpeed objetivo: 90+ mobile
LCP <2.5s, INP <200ms, CLS <0.1. Requiere prerender + optimization de imágenes hero + preload de fonts críticas.

---

## 📊 Score esperado por sprint

| Sprint | Tareas clave | Score |
|---|---|---|
| Actual (post 2026-04-28) | — | **82** |
| Sprint 4 (1 sem) | HTTPS forzado, CSP tightening, /tutoriales hub, home content, HowTo schema | **88** |
| Sprint 5 (1-2 sem) | Code splitting, Lighthouse fixes, HTTP/3 | **91** |
| Sprint 6 (2-4 sem) | Prerender SSG, brand mentions externas | **96** |
| Sprint 7+ (3-6 meses) | Reviews reales, blog técnico, FAQ real | **97-98** |

---

## 💡 Recomendaciones generales

### Mantenimiento mensual
- **Lunes 1 de cada mes**: revisar Google Search Console, ver qué rutas están indexando, qué queries traen tráfico
- **Cada deploy nuevo**: verificar que los 5 archivos root (sitemap, robots, llms, llms-full, og-image) sigan en `/public_html/` después de cualquier upload de zip
- **Trimestral**: re-auditoría con `/seo-audit` para detectar drift

### Decisiones que NO recomendamos cambiar
- **NO incluir aggregateRating ficticio** — Google penaliza
- **NO bloquear AI bots después de desbloquearlos** — la decisión de visibilidad está tomada y es correcta para una marca emergente
- **NO migrar de SiteGround Git deploy a alguna otra plataforma** — el flow actual funciona bien
- **NO refactorear galleryData.js a auto-discovery** — tener title/caption editorial manual es mejor que autogeneración

### Cuando crezca el negocio
- **+10 productos**: refactorizar productData.js a CMS (Sanity, Strapi, o WP custom post types)
- **+5 sucursales**: schema LocalBusiness por sucursal con `branchOf` apuntando a Organization
- **Programa de afiliados**: agregar tracking UTMs en links + Google Analytics 4 con eventos custom
