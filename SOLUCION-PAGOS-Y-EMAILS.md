# Solución: Problemas con Pagos y Emails

## 🔧 Problemas Identificados

### 1. Mercado Pago: Redirige al inicio en lugar de confirmación
**Causa**: La redirección se hacía a través de React Router (`navigate()`), pero cuando WooCommerce redirige desde Mercado Pago, está fuera del contexto de React.

**Solución**: Redirigir directamente con `window.location.href` a la URL de pago de WooCommerce, que luego manejará la redirección a Mercado Pago y el retorno.

### 2. Transferencia Bancaria: No se envía email
**Causa**: 
- La orden se creaba con estado `pending`, que no dispara emails automáticamente
- WooCommerce solo envía emails cuando cambia el estado de la orden, no cuando se crea

**Solución**:
- Crear órdenes de transferencia bancaria con estado `on-hold` (en espera de pago)
- Agregar hook en WordPress para forzar el envío del email cuando se crea una orden `on-hold`

## ✅ Cambios Implementados

### 1. Checkout.jsx - Redirección Mejorada

**ANTES:**
```javascript
if (isMercadoPago) {
  navigate(`/redireccion-pago?...`); // React Router
}
```

**DESPUÉS:**
```javascript
if (isMercadoPago) {
  // Redirigir directamente a WooCommerce (fuera de React Router)
  window.location.href = paymentUrl;
}
```

### 2. woocommerceService.js - Estado Correcto para Transferencia

**ANTES:**
```javascript
status: 'pending', // Siempre pending
```

**DESPUÉS:**
```javascript
const isTransferencia = orderData.payment_method && (
  orderData.payment_method.includes('bacs') ||
  orderData.payment_method.includes('transfer') ||
  // ...
);

const initialStatus = isTransferencia ? 'on-hold' : 'pending';
status: initialStatus, // "on-hold" para transferencia, "pending" para otros
```

### 3. royriff-app.php - Hook para Envío de Emails

**NUEVO:**
```php
function royriff_app_send_order_email_on_creation($order_id, $order) {
    if ($order->get_status() === 'on-hold') {
        // Forzar envío del email de "orden en espera de pago"
        WC()->mailer()->emails['WC_Email_Customer_On_Hold_Order']->trigger($order_id);
    }
}
add_action('woocommerce_new_order', 'royriff_app_send_order_email_on_creation', 20, 2);
```

### 4. royriff-app.php - Redirección después de Mercado Pago

**NUEVO:**
```php
function royriff_app_redirect_after_payment($order_id) {
    // Redirigir a React después del pago exitoso
    $return_url = $order->get_meta('_react_return_url');
    if ($return_url) {
        wp_safe_redirect($return_url . '?order_id=' . $order_id);
        exit;
    }
}
add_action('woocommerce_thankyou', 'royriff_app_redirect_after_payment', 10, 1);
```

### 5. CompraConfirmada.jsx - Página Mejorada

- Muestra información de la orden
- Mensaje específico para transferencia bancaria
- Información sobre el email enviado
- Link a seguimiento de pedido

## 📋 Flujo Corregido

### Mercado Pago:
```
1. Usuario completa checkout → Crea orden en WooCommerce
2. Redirige a: /checkout/order-pay/{order_id}/?key={order_key}
3. WooCommerce redirige a Mercado Pago
4. Usuario paga en Mercado Pago
5. Mercado Pago redirige a WooCommerce (thankyou page)
6. Hook de WordPress redirige a React: /compra-confirmada?order_id=...
7. ✅ Usuario ve página de confirmación en React
```

### Transferencia Bancaria:
```
1. Usuario completa checkout → Crea orden con status "on-hold"
2. Hook de WordPress dispara email automáticamente
3. Redirige a: /compra-confirmada?order_id=...
4. ✅ Usuario ve página de confirmación con instrucciones
5. ✅ Email llega con datos de transferencia
```

## 🚀 Pasos para Aplicar

### 1. Compilar Frontend y actualizar el plugin
```bash
cd frontend
npm run build:plugin
```
Esto hace `vite build` y copia `frontend/dist/` **completo** (incluida la carpeta `assets/`) a `royriff-app-temp/dist/`. Si no, el `index.html` del plugin puede referenciar archivos que no existen en el servidor.

### 2. Subir Archivos al servidor
- **Carpeta completa del plugin** `royriff-app-temp/` (o el nombre final del plugin en WP), incluyendo:
  - `royriff-app.php`
  - **`dist/index.html`** y **`dist/assets/*.js`** y **`dist/assets/*.css`** (la estructura debe coincidir con lo que referencia el `index.html`).

**Error típico:** Si en el servidor aparece "Failed to load resource: 404" y "Refused to execute script... MIME type ('text/html')", es porque los JS/CSS no están en la ruta que espera el plugin: `wp-content/plugins/royriff-app/dist/assets/`. Hay que subir la carpeta `dist` con su subcarpeta `assets` y los archivos con el mismo nombre que en tu `index.html` (ej. `index-DB66JRCD.js`, `index-DepZYId9.css`). Cada nuevo build puede generar nombres distintos; por eso conviene usar `npm run build:plugin` y subir todo `royriff-app-temp/dist/`.

### 3. Configurar URLs de Retorno en WooCommerce

#### En WordPress:
1. Ve a **WooCommerce → Ajustes → Pagos → Mercado Pago**
2. Configura:
   - **URL de retorno**: `https://api.royriff.com.ar/compra-confirmada`
   - **URL de cancelación**: `https://api.royriff.com.ar/pedido-cancelado`

#### Nota sobre URLs:
- Las URLs deben apuntar al mismo dominio donde está WordPress (`api.royriff.com.ar`)
- El hook de WordPress redirigirá automáticamente a React si está configurado
- Si React está en el mismo dominio, las URLs pueden ser relativas

### 4. Verificar Configuración de Emails

#### En WordPress:
1. Ve a **WooCommerce → Ajustes → Emails**
2. Verifica que estos emails estén habilitados:
   - ✅ **"Orden en espera de pago"** (Customer On Hold Order)
   - ✅ **"Nueva orden"** (New Order)
   - ✅ **"Orden completada"** (Order Completed)

### 5. Probar

#### Probar Mercado Pago:
1. Hacer una compra de prueba
2. Seleccionar Mercado Pago
3. Completar el pago (o cancelar)
4. Debe redirigir a `/compra-confirmada` o `/pedido-cancelado`

#### Probar Transferencia Bancaria:
1. Hacer una compra de prueba
2. Seleccionar Transferencia Bancaria
3. Completar el checkout
4. Debe:
   - ✅ Redirigir a `/compra-confirmada`
   - ✅ Enviar email con datos de transferencia
   - ✅ Mostrar mensaje sobre revisar email

## ⚠️ Troubleshooting

### Si Mercado Pago no redirige (p. ej. en incógnito):

1. **Rutas de pago de WooCommerce (causa habitual):** Las URLs `/checkout/order-pay/123` y `/checkout/order-received/123` deben ser atendidas por **WooCommerce**, no por la SPA React. En el plugin `royriff-app` se excluyen estas rutas en las reglas de reescritura y en `template_redirect`. Si no están excluidas, el usuario vuelve a la app y nunca llega a la pantalla de pago. Tras subir el plugin actualizado, reguardar en WP **Ajustes → Enlaces permanentes** (sin cambiar nada) para refrescar reglas.
2. **Fallback en el checkout:** Si aun así la página no redirige, aparece el botón **"Ir a pagar con Mercado Pago"** para que el usuario pueda continuar.
3. **Verificar URLs de retorno en Mercado Pago**:
   - Deben apuntar a `api.royriff.com.ar` (no a React directamente)
   - El hook de WordPress redirigirá a React

2. **Verificar que el hook esté activo**:
   - Revisa que `royriff_app_redirect_after_payment` esté en `royriff-app.php`
   - Verifica que el plugin esté activo

3. **Verificar meta_data de la orden**:
   - La orden debe tener `_react_return_url` en meta_data
   - Esto se agrega automáticamente al crear la orden

### Si no se envía el email de transferencia:

1. **Verificar configuración de emails en WooCommerce**:
   - Ve a **WooCommerce → Ajustes → Emails**
   - Asegúrate de que "Orden en espera de pago" esté habilitado

2. **Verificar estado de la orden**:
   - La orden debe estar en estado "on-hold"
   - Puedes verificar en **WooCommerce → Pedidos**

3. **Verificar configuración SMTP**:
   - Si usas un plugin SMTP, verifica que esté configurado correctamente
   - Prueba enviar un email de prueba desde WordPress

4. **Revisar logs de WordPress**:
   - Activa `WP_DEBUG` y `WP_DEBUG_LOG`
   - Revisa `wp-content/debug.log` para ver errores de email

5. **Emails que llegan a Spam** (comportamiento habitual):
   - El correo **sí se envía**; Gmail y otros pueden clasificarlo como spam (p. ej. "My WordPress via gtxm1164.siteground.biz").
   - Decir al cliente que revise **Spam / correo no deseado** y que use "Reportar como no spam" para futuros correos.
   - Para mejorar entregabilidad: configurar **SPF/DKIM** del dominio, cambiar el nombre del sitio de "My WordPress" a "Roy Riff" en WordPress, y considerar SMTP profesional (SendGrid, Mailgun, etc.).

## 📝 Notas Importantes

- **Estado "on-hold"**: Se usa para transferencia bancaria porque indica que la orden está esperando pago y dispara el email correcto
- **Estado "pending"**: Se usa para Mercado Pago porque el pago se procesa inmediatamente
- **URLs de retorno**: Deben estar configuradas tanto en WooCommerce como en Mercado Pago
- **Emails**: WooCommerce envía emails automáticamente cuando cambia el estado, pero necesitamos forzar el envío al crear órdenes "on-hold"
