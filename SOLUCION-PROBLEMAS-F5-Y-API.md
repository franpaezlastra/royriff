# Solución Completa: Problemas F5 y API 404

## Problemas Identificados y Solucionados

### 1. Error 404 en `/api/products/slug/lola-cruiser-bike`

**Problema**: El endpoint de la API devolvía 404 al buscar productos por slug.

**Causa**: Las rewrite rules de WordPress no estaban interceptando correctamente las rutas `/api/*` antes de que otros plugins las procesaran.

**Solución Implementada**:
- Mejorado el hook `royriff_app_handle_api()` para verificar directamente desde `REQUEST_URI`
- Cambiada la prioridad del hook a `0` (máxima prioridad) para ejecutar antes que otros plugins
- Agregado logging de debug para facilitar troubleshooting

### 2. Página "No encontrado" al presionar F5

**Problema**: Al recargar la página (F5) en rutas como `/carrito` o `/checkout`, WordPress mostraba una página 404 en lugar de la app React.

**Causa**: 
- Las rewrite rules no estaban funcionando correctamente
- El template no se estaba aplicando cuando se accedía directamente a las rutas
- WooCommerce estaba interceptando las rutas antes que nuestro código

**Solución Implementada**:
- Nueva función `royriff_app_intercept_spa_routes()` que intercepta las rutas SPA antes de que WordPress/WooCommerce las procesen
- Mejorada la función `royriff_app_page_template()` con mejor detección de rutas SPA
- Actualizadas las rewrite rules para excluir más rutas de WordPress y plugins
- Prioridad alta en el hook del template (999) para sobrescribir otros templates

### 3. Icono del Carrito Gigante

**Problema**: El icono del carrito en el header era demasiado grande.

**Solución**: Reducido el tamaño del icono de `w-6 h-6` (24px) a `w-5 h-5` (20px) y ajustado el badge del contador.

## Archivos Modificados

1. **`royriff-app-temp/royriff-app.php`**:
   - Mejorado `royriff_app_handle_api()` con verificación directa de REQUEST_URI
   - Nueva función `royriff_app_intercept_spa_routes()` para interceptar rutas SPA
   - Mejorada `royriff_app_page_template()` con mejor detección
   - Actualizadas las rewrite rules con más exclusiones

2. **`royriff-app-temp/templates/page-solo-app.php`**:
   - Creado template mejorado que maneja correctamente las rutas SPA

3. **`royriff-app-temp/includes/class-royriff-api.php`**:
   - Agregado logging de debug
   - Mejorado manejo de errores con mensajes más descriptivos

4. **`frontend/src/components/layout/Header.jsx`**:
   - Reducido tamaño del icono del carrito

## Pasos para Aplicar la Solución

### 1. Compilar el Frontend
```bash
cd frontend
npm run build
```

### 2. Subir Archivos al Servidor
- Sube la carpeta `frontend/dist` completa
- Sube el archivo `royriff-app-temp/royriff-app.php` actualizado
- Sube el archivo `royriff-app-temp/templates/page-solo-app.php` (nuevo)
- Sube el archivo `royriff-app-temp/includes/class-royriff-api.php` actualizado

### 3. En WordPress

#### A. Regenerar Rewrite Rules
1. Ve a **Ajustes → Enlaces permanentes**
2. Haz clic en **"Guardar cambios"** (sin cambiar nada)
3. Esto regenera las rewrite rules con las nuevas reglas

#### B. Verificar Configuración
1. Ve a **Ajustes → Lectura**
2. Verifica que la **"Página principal"** esté configurada correctamente
3. Asegúrate de que esa página tenga el shortcode `[royriff_app]`

#### C. Desactivar y Reactivar el Plugin (Recomendado)
1. Ve a **Plugins → Plugins instalados**
2. Desactiva **"Roy Riff App"**
3. Actívalo nuevamente
4. Esto ejecuta el hook de activación que regenera las rewrite rules

#### D. Limpiar Caché (Si aplica)
- Si usas algún plugin de caché (WP Super Cache, W3 Total Cache, etc.), límpialo
- Si usas caché del servidor, límpialo también

### 4. Verificar que Funcione

#### Probar la API
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Navega a una página de producto (ej: `/bicicletas-electricas/lola-cruiser-bike`)
4. Verifica que la petición a `/api/products/slug/lola-cruiser-bike` devuelva **200 OK** en lugar de 404

#### Probar F5
1. Navega a `/carrito`
2. Presiona **F5** (recargar)
3. Debe mantenerse en la página del carrito (no mostrar 404)
4. Repite con `/checkout`

## Troubleshooting

### Si la API sigue dando 404:

1. **Verificar que las rewrite rules estén activas**:
   - Ve a **Ajustes → Enlaces permanentes**
   - Guarda los cambios nuevamente

2. **Verificar que el plugin esté activo**:
   - Ve a **Plugins → Plugins instalados**
   - Asegúrate de que "Roy Riff App" esté activado

3. **Verificar las credenciales de WooCommerce**:
   - Ve a **WordPress → Ajustes → Roy Riff App**
   - Verifica que las Consumer Key y Consumer Secret estén correctas
   - Verifica que las credenciales tengan permisos de lectura en WooCommerce

4. **Activar WP_DEBUG** (solo en desarrollo):
   - Agrega esto a `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
   - Revisa los logs en `wp-content/debug.log` para ver mensajes de error

### Si F5 sigue mostrando 404:

1. **Verificar que la página principal tenga el shortcode**:
   - Ve a **Páginas → Todas las páginas**
   - Edita la página principal
   - Verifica que tenga `[royriff_app]` en el contenido

2. **Verificar configuración de página principal**:
   - Ve a **Ajustes → Lectura**
   - Verifica que la "Página principal" esté seleccionada correctamente

3. **Verificar que el template exista**:
   - Verifica que el archivo `templates/page-solo-app.php` exista en el plugin
   - Verifica los permisos del archivo

## Notas Importantes

- **Las rewrite rules solo se regeneran cuando**: 
  - Se activa/desactiva el plugin
  - Se guardan los cambios en "Enlaces permanentes"
  - Se llama manualmente a `flush_rewrite_rules()`

- **El orden de los hooks es crítico**:
  - API debe ejecutarse primero (prioridad 0)
  - Interceptación de rutas SPA debe ejecutarse después (prioridad 5)
  - Template debe tener prioridad alta (999)

- **Si tienes otros plugins que modifican rewrite rules**, pueden causar conflictos. En ese caso, puede ser necesario ajustar las prioridades.
