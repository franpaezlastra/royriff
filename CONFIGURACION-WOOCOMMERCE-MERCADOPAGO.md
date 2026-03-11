# 🔧 Configuración de Redirecciones WooCommerce + Mercado Pago

## 📋 Problema

Cuando cancelas un pedido en Mercado Pago, WooCommerce no sabe a dónde redirigir porque React está en otro dominio (`react.royriff.com.ar`) y WooCommerce está en `api.royriff.com.ar`.

## ✅ Solución

Necesitás configurar las URLs de retorno en **WooCommerce** y **Mercado Pago** para que redirijan a tu frontend de React.

---

## 🎯 Paso 1: Configurar Mercado Pago en WooCommerce

1. **En WordPress**, andá a **WooCommerce > Ajustes > Pagos > Mercado Pago**
2. Buscá las siguientes opciones:
   - **"URL de retorno"** o **"Return URL"**
   - **"URL de cancelación"** o **"Cancel URL"**
3. Configurá estas URLs:
   ```
   URL de retorno (éxito): https://react.royriff.com.ar/compra-confirmada
   URL de cancelación: https://react.royriff.com.ar/pedido-cancelado
   ```
4. **Guardá los cambios**

---

## 🎯 Paso 2: Configurar WooCommerce para redirigir a React

### Opción A: Usar un plugin (Recomendado)

1. Instalá el plugin **"WooCommerce Thank You Page Redirect"** o **"Custom Thank You Page"**
2. Configurá la URL de redirección después del pago a: `https://react.royriff.com.ar/compra-confirmada`
3. Configurá la URL de cancelación a: `https://react.royriff.com.ar/pedido-cancelado`

### Opción B: Agregar código PHP (Avanzado)

Si tenés acceso al código de WordPress, agregá esto en `functions.php` de tu tema:

```php
// Redirigir después del pago exitoso
add_action('woocommerce_thankyou', 'redirect_to_react_after_payment', 10, 1);
function redirect_to_react_after_payment($order_id) {
    if (!$order_id) return;
    
    $order = wc_get_order($order_id);
    
    // Solo redirigir si el pago fue exitoso
    if ($order->get_status() === 'processing' || $order->get_status() === 'completed') {
        $return_url = 'https://react.royriff.com.ar/compra-confirmada?order_id=' . $order_id . '&order_key=' . $order->get_order_key();
        wp_redirect($return_url);
        exit;
    }
}

// Redirigir cuando se cancela un pedido
add_action('woocommerce_cancelled_order', 'redirect_to_react_on_cancel', 10, 1);
function redirect_to_react_on_cancel($order_id) {
    if (!$order_id) return;
    
    $order = wc_get_order($order_id);
    $cancel_url = 'https://react.royriff.com.ar/pedido-cancelado?order_id=' . $order_id;
    wp_redirect($cancel_url);
    exit;
}
```

---

## 🎯 Paso 3: Verificar que el CSS esté aplicado

1. En WordPress, andá a **Apariencia > Personalizar > CSS adicional**
2. Asegurate de que el CSS completo de `checkout-custom-styles.css` esté pegado
3. Hacé clic en **"Publicar"**

---

## 🧪 Cómo probar

1. **Hacé una compra de prueba** desde React (`react.royriff.com.ar`)
2. **Completá el checkout** y seleccioná Mercado Pago
3. **En Mercado Pago**, cancelá el pago
4. **Deberías ser redirigido** a `react.royriff.com.ar/pedido-cancelado` (tu página de React)

---

## ⚠️ Notas importantes

- **Las URLs deben ser HTTPS** en producción
- **Asegurate de que CORS esté configurado** correctamente
- **El plugin de Mercado Pago** debe estar actualizado
- **Las URLs de retorno** deben coincidir exactamente con las rutas de React

---

## 🆘 Si no funciona

1. **Verificá que las URLs sean correctas** (sin espacios, con https://)
2. **Revisá la consola del navegador** para ver errores
3. **Verificá que el plugin de Mercado Pago** tenga las URLs configuradas
4. **Probá en modo incógnito** para descartar problemas de caché

---

## 📞 Soporte

Si seguís teniendo problemas, verificá:
- Los logs de WooCommerce (WooCommerce > Estado > Logs)
- Los logs de Mercado Pago en su panel
- La configuración de CORS en WordPress
