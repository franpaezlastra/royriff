# Cómo verificar que los pagos están bien (sin hacer un pago real)

Guía para comprobar que el flujo de checkout, creación de orden y pasarela funcionan **sin tener que completar un pago con dinero real**.

---

## 1. Checklist rápido (sin pagar)

Podés validar casi todo el flujo sin llegar a pagar.

### 1.1 La app carga bien

- [ ] Entrá a `https://api.royriff.com.ar` en **modo incógnito**.
- [ ] La página muestra la tienda (no pantalla en blanco).
- [ ] En F12 → Consola **no** hay errores 404 de `index-XXXXX.js` ni "MIME type ('text/html')".

Si falla: el `dist` del plugin no está bien subido (ver `SOLUCION-PAGOS-Y-EMAILS.md`).

### 1.2 Checkout y creación de orden

- [ ] Agregá un producto al carrito y andá a **Checkout**.
- [ ] Completá el formulario (nombre, email, etc.) y elegí **Transferencia bancaria**.
- [ ] Hacé clic en **Finalizar compra**.

**Qué debería pasar:** Te redirige a **Compra confirmada** y ves el mensaje de “revisá tu email para los datos de transferencia”. No se usa Mercado Pago; solo se crea la orden en WooCommerce.

**Qué revisar:**

- Si ves la página de confirmación → la **creación de orden por API** funciona.
- Revisá **WooCommerce → Pedidos** en WordPress: debería aparecer una orden nueva en estado “En espera de pago” (o similar).
- Revisá el email (y **Spam**): deberías recibir el correo de “orden en espera de pago”.

Si esto funciona, **transferencia bancaria está bien** y la API de órdenes también.

### 1.3 Que la URL de pago de WooCommerce exista (Mercado Pago)

Acá no pagás; solo comprobás que la URL a la que irías a pagar **existe** y la sirve WooCommerce (no la SPA).

- [ ] En WordPress: **WooCommerce → Pedidos**.
- [ ] Abrí cualquier orden **pendiente** (o creá una de prueba como en 1.2).
- [ ] En la orden, buscá el enlace tipo **“Pagar”** o “Pagar orden” (o la URL que usa WooCommerce para pagar esa orden).  
  O construí la URL a mano:  
  `https://api.royriff.com.ar/checkout/order-pay/{ID_ORDEN}/?key={ORDER_KEY}`  
  (el `order_key` lo ves en la ficha de la orden o en el email de “orden en espera”).

- [ ] Abrí esa URL en **otra pestaña** (o en incógnito).

**Qué debería pasar:**

- Se carga la **página de WooCommerce** para pagar esa orden (formulario de pago, botón de Mercado Pago, etc.).
- **No** debería cargarse tu checkout de React (ni pantalla en blanco por 404 de JS).

Si ves la página de pago de WooCommerce → la **ruta `order-pay`** está bien configurada y el plugin no la está “tragando” con la SPA. El flujo hasta Mercado Pago está abierto; solo faltaría probar el pago en sí (con modo prueba).

### 1.4 Resumen de qué probaste

| Prueba                         | Qué valida                          | ¿Necesitás pagar? |
|--------------------------------|-------------------------------------|--------------------|
| App carga en incógnito         | Plugin y `dist` correctos           | No                 |
| Checkout + transferencia       | API de órdenes y email              | No                 |
| Abrir URL `order-pay` a mano   | Que WooCommerce sirva la pasarela   | No                 |
| Completar pago con Mercado Pago| Flujo completo de pago              | Solo con modo prueba (ver abajo) |

---

## 2. Probar Mercado Pago sin cobrar de verdad (modo prueba)

Mercado Pago tiene **credenciales de prueba** y **tarjetas de prueba**. No se mueve dinero real.

### 2.1 Activar modo prueba en el plugin de Mercado Pago (WooCommerce)

1. En WordPress: **WooCommerce → Ajustes → Pagos**.
2. Entrá al método **Mercado Pago**.
3. Buscá la opción tipo **“Modo prueba” / “Sandbox” / “Credenciales de prueba”** y activala.
4. Reemplazá las credenciales por las **de prueba** (Public Key y Access Token de prueba).
5. Las credenciales de prueba se sacan desde:  
   [Mercado Pago Developers](https://www.mercadopago.com.ar/developers) → Tu aplicación → **Credenciales de prueba**.

Mientras esté en modo prueba, los pagos no son reales.

### 2.2 Tarjetas de prueba de Mercado Pago

En la documentación de Mercado Pago para WooCommerce suelen indicar tarjetas de prueba, por ejemplo:

- **Mastercard (aprobada):** `5031 7557 2343 0604`
- **Visa (aprobada):** `4509 9535 6623 3704`
- **Rechazada:** para probar rechazos
- **Pendiente:** para probar pagos pendientes

La lista exacta y actual está en:  
[https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/test-cards](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/test-cards)  
(o la sección “Tarjetas de prueba” de la doc de WooCommerce).

Podés usar cualquier fecha futura y cualquier CVV (ej. 123). El DNI puede ser un número de prueba que indique la documentación.

### 2.3 Flujo de prueba completo (con modo prueba activado)

1. En la tienda: agregar producto → Checkout.
2. Elegir **Mercado Pago** como método de pago.
3. Finalizar compra → deberías ir a la URL `order-pay` y ver el formulario/botón de Mercado Pago.
4. Completar con una **tarjeta de prueba** (no se debita nada).
5. Tras el pago, Mercado Pago y el hook de WordPress deberían redirigirte a **Compra confirmada** en React.

Si todo eso pasa, el flujo de pagos está funcionando de punta a punta.

---

## 3. Verificación rápida desde la consola (opcional)

En la página de **Checkout** de tu sitio (React), con la consola abierta (F12):

1. Después de hacer clic en **Finalizar compra** con Mercado Pago, en la consola suelen aparecer logs como:
   - `Order data being sent: ...`
   - `Payment method: woo-mercado-pago-basic` (o similar).

2. Si ves **“Si no te redirigió, usá el botón…”** y aparece el botón **“Ir a pagar con Mercado Pago”**, hacé clic: debería llevarte a la misma URL `order-pay` que verificaste en 1.3.

Eso confirma que el front construye bien la URL y que tenés un plan B si la redirección automática falla.

---

## 4. Resumen: “¿Cómo sé si ya está andando bien?”

- **Sin tocar pagos reales:**  
  Hacé las pruebas de la **sección 1** (app carga, checkout con transferencia, abrir `order-pay` a mano). Si todo eso pasa, la base está bien.

- **Para estar seguro con Mercado Pago:**  
  Activá **modo prueba** en el plugin, usá **tarjetas de prueba** y completá un pago de punta a punta (sección 2). Así sabés que el flujo de pago está andando bien sin arriesgar dinero real.
