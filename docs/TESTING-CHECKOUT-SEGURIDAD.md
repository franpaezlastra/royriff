# Testing del carrito / checkout y seguridad

## Objetivo

Cubrir **combinaciones de carrito + envío** y comprobar que **nadie pueda abusar del API** para crear pedidos con envíos o totales falsos.

---

## 1. Tests automáticos (rápidos, en cada cambio)

En el frontend ya hay **Vitest** y tests de la lógica que decide tipo de envío y meta `royriff_fulfillment`:

```bash
cd frontend
npm run test
```

Archivo: `frontend/src/utils/shippingClassify.test.js`.

**Qué cubren:** retiro en local vs domicilio vs sucursal (incl. heurísticas Andreani), `getFulfillmentKind`, filtrado de tarifas duplicadas.

**Qué no cubren:** llamadas reales a WordPress/WooCommerce (hace falta entorno o tests de integración).

---

## 2. Matriz manual de QA (revisión humana periódica)

Probar al menos una vez por release o tras cambiar envíos en WooCommerce.

| # | Carrito | Envío elegido | Paso checkout | Resultado esperado |
|---|---------|---------------|---------------|-------------------|
| 1 | 1 producto simple | Retiro en local | Ir a pago directo | Pedido con `local_pickup`, coste envío 0, meta coherente |
| 2 | 1 producto | CP válido + domicilio | Entrega → Pago | Dirección con nota “Envío a domicilio”, coste = recálculo servidor |
| 3 | 1 producto | CP válido + sucursal Andreani (o similar) | Entrega → Pago | Nota sucursal en dirección envío, método coincide con WC |
| 4 | Producto con variación | Igual que 2 o 3 | — | `variation_id` en línea de pedido |
| 5 | Varios ítems | Mismo CP, cambiar método | — | Total envío según método válido |
| 6 | Cambiar CP después de calcular | Recalcular | — | No queda tarifa vieja aplicada |
| 7 | Carrito vacío | — | `/checkout/pago` | Redirección a carrito o entrega según reglas actuales |
| 8 | Drawer vs página carrito | Mismo flujo | — | Mismo comportamiento que página carrito |

Opcional: probar en **móvil** y con **usuario sin datos guardados** en `localStorage` (ventana privada).

---

## 3. Pruebas de seguridad (anti‑manipulación)

La **fuente de verdad** del coste de envío y del método válido es el **servidor** (`class-royriff-api.php`), no el navegador.

### Comportamiento defensivo actual (resumen)

- **POST órdenes:** el cuerpo se **sanea** antes de ir a WooCommerce: sin `fee_lines`/`coupon_lines` arbitrarios desde el cliente; `line_items` sin totales inventados; `meta_data` solo URLs de retorno permitidas + `royriff_fulfillment` con valores cerrados.
- **Envío:** para métodos distintos de `local_pickup`, el servidor **vuelve a calcular** tarifas con el mismo motor que `/api/shipping/calculate`, exige **CP**, y **sustituye** el `total` de la línea de envío por el coste confiable. Si el `method_id` no existe para ese CP/carrito → **400**.
- **Local pickup:** total forzado a **0**; si llega `local_pickup` genérico, se intenta enlazar a la **instancia real** en WC.
- **GET pedido:** solo datos mínimos y **solo con `order_key`** correcto.
- **PUT/DELETE órdenes** por API pública: **403**.

### Cómo “atacar” vos mismo (pentest ligero)

Con **Postman**, **curl** o DevTools → pestaña Red, repetir POST a `/api/orders` (misma URL que usa el front) y variar el JSON:

| Intento | Qué debería pasar |
|--------|-------------------|
| `shipping_lines[0].total = "0"` en envío a domicilio con coste real | El servidor **ignora** el 0 y pone el coste recalculado |
| `method_id` de otra zona o inventado | **400** — método no válido |
| Sin CP en billing/shipping para envío calculado | **400** — CP requerido |
| `meta_data` con claves arbitrarias (descuentos, notas internas) | **Se descartan** salvo las permitidas |
| `fee_lines` con cargos negativos | **Se eliminan** del payload |
| GET `/api/orders/123` sin `order_key` | **403** |
| GET con `order_key` incorrecto | **403** |

**Importante:** las **claves de API de WooCommerce** deben estar solo en el servidor (WordPress), nunca en el repo público ni en el bundle del front si ese bundle fuera a exponerlas (hoy el front llama a tu dominio que proxya con Basic Auth en servidor).

---

## 4. Siguiente nivel (opcional)

- **E2E:** Playwright o Cypress recorriendo carrito → entrega → pago en staging (con datos de prueba y sin cobrar tarjetas reales).
- **PHPUnit** en el plugin: tests de `sanitize_order_create_payload` y `apply_trusted_shipping_lines` con JSON de ejemplo (requiere bootstrap de WordPress o mocks).
- **Monitorización:** alertar si sube mucho el ratio de **400** en POST `/api/orders`.

---

## Comando útil

```bash
cd frontend && npm run test        # una pasada
cd frontend && npm run test:watch  # mientras desarrollás
```
