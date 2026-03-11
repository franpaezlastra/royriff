# Desarrollo local consumiendo la API (temporal)

Mientras la app está en desarrollo, el frontend en **localhost** (npm run dev) consume la API que está en **api.royriff.com.ar** mediante un **proxy** en Vite.

## Qué está configurado

- **vite.config.js** → `server.proxy['/api']`: redirige todas las peticiones a `https://api.royriff.com.ar`. Así en el navegador seguís usando `localhost:3000/api/...` y Vite reenvía a producción.
- **woocommerceService.js** → sigue usando `baseURL: '/api'`; no hace falta cambiar nada ahí.

## Al publicar la página

Cuando la app esté publicada en el mismo dominio que la API (por ejemplo todo en api.royriff.com.ar), **eliminá el bloque de proxy** en `vite.config.js`:

- Quitá la entrada `'/api': { target: '...', changeOrigin: true, secure: true }` (y el comentario TEMPORAL que está arriba).
- Dejá el objeto `proxy` vacío `{}` o eliminá la clave `proxy` si no usás otro proxy.

Así en producción las peticiones a `/api` van al mismo origen y no pasan por el proxy de desarrollo.

**Resumen:** El código temporal es solo el proxy de `/api` en **vite.config.js**. Una vez publicada la página, borrar esa configuración (y este archivo si querés).
