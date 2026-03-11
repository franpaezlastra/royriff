# Configurar Credenciales de WooCommerce - Guía Paso a Paso

## ⚠️ Error 401: Credenciales Inválidas

Si estás viendo errores **401 (No autorizado)** en la consola del navegador, significa que las credenciales de WooCommerce no están configuradas correctamente.

---

## 📋 Pasos para Configurar las Credenciales

### Paso 1: Crear las Credenciales en WooCommerce

1. **Ve a WordPress Admin** → **WooCommerce** → **Ajustes** → **Avanzado** → **API REST**

2. **Crea una nueva clave API**:
   - Haz clic en **"Añadir clave"** o **"Add key"**
   - **Descripción**: `Roy Riff App` (o el nombre que prefieras)
   - **Usuario**: Selecciona tu usuario administrador
   - **Permisos**: Selecciona **"Lectura/Escritura"** (Read/Write) para que funcione el checkout completo
   - Haz clic en **"Generar API key"**

3. **Copia las credenciales**:
   - Se generarán dos valores:
     - **Consumer Key** (clave pública)
     - **Consumer Secret** (clave secreta)
   - ⚠️ **IMPORTANTE**: Copia ambas inmediatamente, porque el Consumer Secret solo se muestra una vez

---

### Paso 2: Configurar las Credenciales en el Plugin

1. **Ve a WordPress Admin** → **Ajustes** → **Roy Riff App**

2. **Pega las credenciales**:
   - **Consumer key**: Pega el Consumer Key que copiaste
   - **Consumer secret**: Pega el Consumer Secret que copiaste

3. **Haz clic en "Guardar"**

---

### Paso 3: Verificar que Funciona

1. **Abre tu sitio** en el navegador (ej: `https://api.royriff.com.ar/tienda`)

2. **Abre la consola del navegador** (F12 → pestaña "Console")

3. **Recarga la página** y verifica:
   - ✅ **NO deberías ver errores 401**
   - ✅ Deberías ver los productos cargando
   - ✅ Si vas al checkout, deberías ver los métodos de pago

---

## 🔍 Solución de Problemas

### Si sigues viendo error 401 después de configurar:

1. **Verifica que las credenciales estén correctas**:
   - No deben tener espacios al inicio o final
   - No deben tener saltos de línea
   - Deben ser exactamente las que generaste en WooCommerce

2. **Verifica los permisos de la clave API**:
   - Debe tener permisos **"Lectura/Escritura"** (Read/Write)
   - Si solo tiene "Lectura", el checkout no funcionará

3. **Verifica que WooCommerce esté activo**:
   - Ve a **Plugins** y asegúrate de que WooCommerce esté activado

4. **Regenera las credenciales**:
   - Ve a WooCommerce → Ajustes → Avanzado → API REST
   - Elimina la clave antigua
   - Crea una nueva clave
   - Actualiza las credenciales en Ajustes → Roy Riff App

---

### Si no puedes ver la página de configuración:

1. **Verifica que el plugin esté activo**:
   - Ve a **Plugins** y busca "Roy Riff App"
   - Debe estar activado

2. **Verifica permisos de usuario**:
   - Debes estar logueado como administrador
   - Solo usuarios con permisos de administrador pueden ver la página de configuración

---

## 🔒 Seguridad

- **NUNCA** compartas tus credenciales de API
- **NUNCA** las subas a repositorios públicos (GitHub, etc.)
- Si sospechas que fueron comprometidas, **regéneralas inmediatamente** en WooCommerce

---

## 📞 ¿Necesitas Ayuda?

Si después de seguir estos pasos sigues teniendo problemas:

1. **Revisa los logs de WordPress** (si tienes WP_DEBUG activado)
2. **Revisa la consola del navegador** para ver el mensaje de error exacto
3. **Verifica que el plugin esté actualizado** con la última versión
