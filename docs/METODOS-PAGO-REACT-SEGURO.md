# Métodos de Pago en React - Sistema Seguro

## ✅ Resumen

Todo el checkout se maneja **100% en React**, pero de forma **segura** porque:

1. **Los métodos de pago vienen de la API de WooCommerce** (no están hardcodeados)
2. **Las credenciales de API nunca se exponen al navegador** (se manejan en el servidor PHP)
3. **Solo se muestran los 3 métodos que tu cliente necesita**: Mercado Pago, Transferencia Bancaria, y Pagegate (Visa/Mastercard)
4. **Todas las validaciones de seguridad están en el servidor** (PHP)

---

## 🔒 Flujo de Seguridad

### 1. Obtención de Métodos de Pago

```
React Frontend → GET /api/payment_gateways → PHP Proxy → WooCommerce REST API
```

- El frontend **NO tiene acceso directo** a WooCommerce
- El proxy PHP (`class-royriff-api.php`) maneja las credenciales
- Solo se devuelven métodos **habilitados** y **filtrados**

### 2. Filtrado de Métodos

El componente `Checkout.jsx` filtra automáticamente para mostrar solo:

- **Mercado Pago**: Cualquier método que contenga "mercado", "mercadopago", o "mp"
- **Transferencia Bancaria**: Cualquier método que contenga "bacs", "transfer", "bank", o "bancaria"
- **Pagegate/Visa/Mastercard**: Cualquier método que contenga "pagegate", "visa", "mastercard", o "card"

### 3. Creación de Órdenes

```
React Frontend → POST /api/orders → PHP Proxy (VALIDACIONES) → WooCommerce REST API
```

**Validaciones del servidor (PHP):**
- ✅ Email válido
- ✅ Nombre y apellido requeridos
- ✅ Dirección y ciudad requeridas
- ✅ Productos válidos y en stock
- ✅ Rate limiting (máx. 5 órdenes por IP por hora)
- ✅ No permite modificar campos críticos (id, order_key, etc.)

---

## 🎨 Estilos Profesionales

El checkout tiene estilos modernos inspirados en las mejores tiendas online:

- **Campos de formulario**: Bordes suaves, focus states, validación visual
- **Métodos de pago**: Cards con iconos, badges informativos, estados hover/selected
- **Resumen de orden**: Diseño limpio con total destacado, badges de seguridad
- **Responsive**: Funciona perfectamente en móvil, tablet y desktop

---

## 📋 Configuración en WordPress

### 1. Activar Métodos de Pago

Ve a **WooCommerce > Ajustes > Pagos** y activa:

- ✅ **Mercado Pago** (cualquier variante que uses)
- ✅ **Transferencia Bancaria** (BACS o método offline)
- ✅ **Pagegate** o **Visa Acceptance Solutions**

### 2. Verificar IDs de Métodos

Los métodos deben tener IDs que contengan las palabras clave mencionadas arriba. Si un método no aparece, verifica su ID en la consola del navegador (el código hace log de los métodos disponibles).

---

## 🔍 Debugging

Si los métodos de pago no aparecen:

1. **Abre la consola del navegador** (F12)
2. Busca los logs que empiezan con:
   - `✅ Métodos de pago filtrados:` (si funcionó)
   - `⚠️ No se encontraron métodos de pago permitidos` (si hay problema)
   - `📋 Métodos disponibles desde la API:` (para ver qué devuelve WooCommerce)

3. **Verifica en WordPress**:
   - Los métodos están **habilitados** en WooCommerce > Ajustes > Pagos
   - Las credenciales de API están configuradas correctamente
   - El proxy PHP puede acceder a WooCommerce

---

## 🚀 Próximos Pasos

1. **Activa los métodos de pago** en WordPress
2. **Prueba el checkout** en el frontend React
3. **Verifica los logs** en la consola si algo no funciona
4. **Personaliza los estilos** si necesitas ajustar colores/tipografías

---

## ⚠️ Importante

- **NUNCA** expongas las credenciales de API en el frontend
- **SIEMPRE** usa el proxy PHP (`/api/*`) para comunicarte con WooCommerce
- **VALIDA** todo en el servidor, no confíes solo en validaciones del cliente
- **MONITOREA** los logs de seguridad en producción

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de la consola del navegador
2. Verifica que los métodos estén habilitados en WordPress
3. Comprueba que el proxy PHP esté funcionando (`/api/payment_gateways` debe devolver JSON)
