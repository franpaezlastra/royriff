# Análisis: Pasarela de pago con React + WordPress + WooCommerce

Documento de análisis técnico como desarrollador fullstack senior: **todas las posibilidades** para integrar pagos en una arquitectura React (front) + WordPress + WooCommerce (back), y por qué el enfoque actual es válido y cómo mejorarlo.

---

## 1. ¿Se puede hacer? Sí, y de varias formas

**Respuesta corta:** Sí. Es totalmente viable tener el checkout en React y que el cobro lo resuelva WooCommerce (y sus plugins de pago). No es un “hack”: es un patrón habitual en sitios headless o híbridos.

**Condición crítica:** Las URLs de WooCommerce que **sirven** el pago (`/checkout/order-pay/...` y `/checkout/order-received/...`) **no pueden ser interceptadas** por la SPA. Si la SPA “se traga” esas rutas, el usuario nunca llega a la pantalla de pago de WooCommerce ni a la pasarela (Mercado Pago, etc.). En este proyecto eso se corrige en el plugin (exclusión de `order-pay` y `order-received` en reglas de reescritura y en `template_redirect`).

---

## 2. Arquitecturas posibles (resumen)

| Enfoque | Descripción | Pros | Contras |
|--------|-------------|------|---------|
| **A. Híbrido actual** | React: formulario y creación de orden vía API → redirección a WooCommerce `order-pay` → plugin de pago → vuelta a React | Reutiliza plugins WC, un solo backend de órdenes, mantenible | Usuario sale de React solo para el paso de pago |
| **B. Checkout 100% WooCommerce** | React solo catálogo/carrito; “Finalizar compra” lleva a `/checkout` de WooCommerce (página clásica) | Máxima compatibilidad con plugins | UX distinta, hay que sincronizar carrito WC con React |
| **C. Headless puro** | React llama a un endpoint propio que genera link de pago (ej. Mercado Pago) y redirige; webhooks actualizan la orden en WP/WC | Control total en front, misma UX en todo el flujo | Lógica duplicada, mantener webhooks y estados por pasarela |
| **D. iframe / popup** | Formulario de pago de WooCommerce o del gateway dentro de iframe o ventana | No se “pierde” la URL de React | Cookies/dominio, UX y restricciones de iframe suelen ser problemáticas |

Recomendación para este proyecto: **mantener y afinar el enfoque A (híbrido)**. Es el que mejor equilibra mantenibilidad, uso de plugins existentes y UX.

---

## 3. Flujo actual (A) explicado paso a paso

```
1. Usuario en React: /checkout (formulario, método de pago, etc.)
2. React envía POST /api/orders con billing, line_items, payment_method.
3. Plugin proxy → WooCommerce REST API crea la orden (pending o on-hold).
4. Respuesta incluye order.id y order.order_key.
5. Si pago es Mercado Pago (u otro redirect):
   - React hace window.location.replace( baseUrl + "/checkout/order-pay/" + orderId + "/?key=" + orderKey )
6. El navegador pide esa URL al mismo dominio (api.royriff.com.ar).
7. IMPORTANTE: Esa petición NO debe ser capturada por la SPA.
   - Reglas de reescritura excluyen paths que contienen /order-pay/ y /order-received/.
   - template_redirect también deja pasar esos paths.
   - Así WordPress/WooCommerce sirve la página de “Pagar orden” (order-pay).
8. En esa página, el plugin de Mercado Pago (u otro) muestra el botón o redirige a la pasarela.
9. Usuario paga en Mercado Pago; la pasarela redirige a WooCommerce (order-received).
10. Hook woocommerce_thankyou redirige al usuario a React: /compra-confirmada?order_id=...&order_key=...
11. React muestra la confirmación.
```

Si en el paso 7 la SPA interceptaba `/checkout/order-pay/...`, el usuario volvía a ver el checkout de React (o “Procesando…” sin avanzar). **Bug corregido:** En el plugin se excluyen las rutas `/order-pay/` y `/order-received/` en rewrites y en `template_redirect` para que WooCommerce sirva la pasarela; así la redirección a Mercado Pago (también en incógnito) puede funcionar.

---

## 4. Detalles técnicos que importan

### 4.1 Slug de la página de checkout en WooCommerce

La URL de pago depende del **slug de la página de checkout** en WordPress (WooCommerce → Ajustes → Avanzado → Páginas). Si el slug es `checkout`, la URL es:

- Pago: `https://api.royriff.com.ar/checkout/order-pay/{id}/?key={order_key}`
- Gracias: `https://api.royriff.com.ar/checkout/order-received/{id}/?key={order_key}`

Si en tu instalación el slug es otro (por ejemplo `finalizar-compra`), la URL base debe usar ese slug. En el frontend se usa `VITE_WOOCOMMERCE_URL` y el path `/checkout/order-pay/...`. Si cambias el slug en WP, hay que alinear esa constante o hacerla configurable (por ejemplo opción en WP que el plugin exponga vía API o variable de entorno).

### 4.2 Cookies y sesión

- La orden se crea por **REST API con credenciales de aplicación** (consumer key/secret en el servidor). No depende de la sesión de usuario en WordPress.
- La página `order-pay` identifica la orden por **order_id + order_key** en la URL. No requiere que el usuario esté logueado en WP. Por eso el flujo funciona también en incógnito, siempre que la URL de order-pay sea la que sirve WooCommerce y no la SPA.

### 4.3 Respuesta de la API al crear orden

WooCommerce REST API devuelve en la orden, entre otros:

- `id` (o a veces `number`)
- `order_key`

El frontend debe usar ambos para construir la URL de order-pay. Si faltara `order_key`, la URL sería inválida y WooCommerce podría rechazar o mostrar error.

### 4.4 URLs de retorno de Mercado Pago (u otras pasarelas)

En el plugin de Mercado Pago (en WooCommerce) suelen configurarse:

- URL de retorno exitoso: puede ser la de WooCommerce (p. ej. `.../checkout/order-received/...`) o, si el plugin lo permite, una URL de React. En este proyecto el hook en `woocommerce_thankyou` redirige a React, así que dar la URL de WooCommerce suele ser suficiente.
- URL de cancelación: puede apuntar a una ruta de React (ej. `/pedido-cancelado`) si el plugin acepta URLs externas.

---

## 5. Otras opciones (cuándo tenerlas en cuenta)

### 5.1 Headless “puro” (opción C)

- **Idea:** Un endpoint en el plugin (o en un microservicio) que, dado `order_id` y método de pago, llame a la API de Mercado Pago (o la pasarela), genere el link de pago y lo devuelva a React. React solo redirige a ese link. El webhook de la pasarela actualiza el estado de la orden en WooCommerce.
- **Ventaja:** La “cara” del pago es siempre la de la pasarela; no dependes de la página order-pay de WooCommerce.
- **Desventaja:** Hay que replicar/adaptar la lógica de cada gateway (Mercado Pago, otros), mantener webhooks y posibles diferencias con lo que hace el plugin oficial de WC. Más código y mantenimiento.

Solo compensa si necesitas una UX muy específica o si los plugins de WC no cubren tu caso.

### 5.2 Checkout 100% WooCommerce (opción B)

- **Idea:** Carrito en React; al “Finalizar compra” redirigir a la página de checkout de WooCommerce (misma URL que usa WC). El carrito debe existir en la sesión de WooCommerce (por ejemplo sincronizando vía API o añadiendo productos por sesión).
- **Ventaja:** Cero problemas de rutas; todo el flujo de pago es el nativo de WC.
- **Desventaja:** Sincronizar carrito React ↔ WC y que la UX sea coherente requiere trabajo; el usuario cambia de “app” a tema WP en el checkout.

Útil si priorizas máxima compatibilidad con plugins y no te importa que el último paso sea la pantalla clásica de WC.

---

## 6. Checklist de verificación (producción)

- [ ] **Permalinks:** En WP, Ajustes → Enlaces permanentes, tener “Nombre de la entrada” (o cualquier estructura que no sea “simple”) para que `/checkout/order-pay/123` funcione.
- [ ] **Página de checkout:** WooCommerce → Ajustes → Avanzado → Páginas: comprobar que la página de checkout existe y anotar su **slug** (debe coincidir con la base de la URL que usa React).
- [ ] **Plugin royriff-app:** Reglas de reescritura que **excluyan** paths con `/order-pay/` y `/order-received/`; en `template_redirect`, no interceptar esas rutas.
- [ ] **Frontend:** Tras crear la orden, redirección a `{baseUrl}/{checkout_slug}/order-pay/{orderId}/?key={orderKey}` (normalmente `checkout_slug = "checkout"`).
- [ ] **Mercado Pago (o gateway):** URLs de retorno/cancelación configuradas; si hace falta, apuntar a la misma base que usa la app (api.royriff.com.ar) y dejar que el hook thankyou redirija a React.
- [ ] **Fallback en React:** Si la redirección no ocurre (bloqueadores, incógnito, etc.), mostrar enlace/botón “Ir a pagar con Mercado Pago” con la misma URL de order-pay.

---

## 7. Conclusión

- **Sí se puede** implementar la pasarela de pago con React + WordPress + WooCommerce de forma sólida.
- El enfoque **híbrido (A)** que usamos es el más razonable: React para formulario y creación de orden; WooCommerce para order-pay y plugins de pago; vuelta a React para la confirmación.
- La condición **indispensable** es que las rutas de pago de WooCommerce (`/.../order-pay/...` y `/.../order-received/...`) **no sean manejadas por la SPA**; en este proyecto eso se asegura en el plugin con la exclusión en rewrites y en `template_redirect`.
- Con eso, el flujo en incógnito y en navegación normal puede funcionar igual; el botón “Ir a pagar con Mercado Pago” sigue siendo un buen respaldo ante fallos de redirección del navegador.

Si más adelante necesitas un flujo 100% headless (opción C) o migrar a checkout 100% WooCommerce (opción B), este documento sirve como base para decidir y planificar los cambios.
