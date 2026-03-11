=== Roy Riff App ===

Instalación:
1. Copiar la carpeta royriff-app a wp-content/plugins/
2. En frontend del proyecto: npm run build y copiar TODO el contenido de frontend/dist/ dentro de plugins/royriff-app/dist/
3. Activar el plugin en WordPress
4. Crear página con slug "tienda" y contenido [royriff_app]
5. Ajustes → Roy Riff App: pegar Consumer key y Consumer secret de WooCommerce (WooCommerce → Ajustes → Avanzado → API REST)

La app se verá en https://tusitio.com/tienda (y /tienda/carrito, /tienda/checkout, etc. en la misma URL).
