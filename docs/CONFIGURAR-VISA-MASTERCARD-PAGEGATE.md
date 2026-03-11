# Cómo configurar Visa y Mastercard (Visa Acceptance Solutions / Pagegate) en WooCommerce

## Opción 1: Visa Acceptance Solutions (lo que tenés en la imagen)

En la pantalla de **WooCommerce → Ajustes → Pagos** aparece **"Visa Acceptance Solutions"** con el botón **"Completar instalación"**. Este es el gateway oficial de WooCommerce para aceptar Visa y Mastercard.

### Pasos para configurar

1. **Completar la instalación**
   - En **WooCommerce → Ajustes → Pagos**, hacé clic en **"Completar instalación"** en la tarjeta de Visa Acceptance Solutions.
   - Te va a pedir (o redirigir) a:
     - Crear o vincular una cuenta en **Cybersource** (plataforma que usa Visa Acceptance Solutions).
     - Aceptar términos y condiciones.
   - Si te pide una **cuenta de comercio (merchant account)** de tu banco o procesador, tenés que tenerla ya contratada (Visa/Mastercard por lo general se procesan con un acquirer o procesador de pagos).

2. **Configurar credenciales**
   - Después de completar la instalación, entrá a **"Gestionar"** en Visa Acceptance Solutions.
   - Ahí vas a cargar:
     - **Merchant ID** (o similar) que te da tu banco/procesador.
     - **API Key / Secret** (o certificados) según lo que pida la integración.
   - Guardá los cambios.

3. **Habilitar el método**
   - Asegurate de que el método **Visa Acceptance Solutions** quede **Activo** (no "Inactivo").
   - En la app React, el checkout ya está preparado para mostrar cualquier método que tenga en el ID o título palabras como `visa`, `mastercard`, `card`, `acceptance` o `pagegate`.

4. **URLs de retorno (si aplica)**
   - Si después del pago con tarjeta te redirige a una página de confirmación de WooCommerce y querés que vaya a tu React:
   - En la configuración del gateway, si hay campos de **URL de retorno** o **Return URL**, usá:
     - Éxito: `https://api.royriff.com.ar/compra-confirmada`
     - Error/Cancelar: `https://api.royriff.com.ar/pedido-cancelado`

---

## Opción 2: Si usás Pagegate u otro gateway (Visa/Mastercard)

Si en lugar de Visa Acceptance Solutions usás **Pagegate** u otro plugin de tarjetas:

1. **Instalar el plugin**
   - **Extensiones → Añadir nueva** (o **Plugins → Añadir nuevo**).
   - Buscá "Pagegate" o el nombre del plugin que te dio tu procesador/banco.
   - Instalá y activá el plugin.

2. **Configurarlo en Pagos**
   - **WooCommerce → Ajustes → Pagos**.
   - Debería aparecer un nuevo método (ej. "Pagegate", "Tarjetas Visa/Mastercard").
   - Clic en **"Activar"** y luego **"Gestionar"**.

3. **Datos que suelen pedir**
   - Merchant ID / ID de comercio.
   - API Key / API Secret (o usuario y contraseña que te da Pagegate).
   - A veces: URL de notificación (webhook) y URLs de retorno.
   - Modo prueba / producción.

4. **URLs de retorno para React**
   - Si el plugin permite configurar URLs de retorno:
     - **Retorno exitoso:** `https://api.royriff.com.ar/compra-confirmada`
     - **Retorno cancelado/error:** `https://api.royriff.com.ar/pedido-cancelado`

5. **Que aparezca en el checkout React**
   - El checkout de la app ya filtra métodos que contengan en el ID o título: `pagegate`, `visa`, `mastercard`, `card`, `acceptance`.
   - Mientras el método en WooCommerce tenga uno de esos nombres (o "Pagegate" en el título), debería mostrarse como opción de tarjeta en React.

---

## Resumen rápido

| Qué querés hacer | Dónde |
|------------------|--------|
| Usar Visa Acceptance Solutions (imagen) | Clic en **"Completar instalación"** y seguir los pasos de Cybersource / WooCommerce. |
| Usar Pagegate | Instalar el plugin de Pagegate, activarlo en **Pagos** y completar **Gestionar** con las credenciales que te dio Pagegate. |
| Que Visa/Mastercard aparezca en React | Dejar el método activo en WooCommerce; la app ya lo muestra si el ID o título incluye visa, mastercard, card, acceptance o pagegate. |
| Redirigir después del pago a React | Configurar en el gateway (si tiene opción) las URLs de retorno a `api.royriff.com.ar/compra-confirmada` y `pedido-cancelado`. |

---

## Si no tenés aún cuenta de comercio (Visa/Mastercard)

Para aceptar Visa y Mastercard necesitás:

- Una **cuenta de comercio (merchant account)** con un banco o procesador que te permita recibir pagos con tarjeta.
- O un servicio como **Pagegate** (u otro que use tu banco) que te dé:
  - Merchant ID
  - API Key / Secret (o usuario y contraseña)

Sin eso, podés dejar **Visa Acceptance Solutions** instalado pero no vas a poder completar la configuración hasta tener las credenciales. Mientras tanto, Mercado Pago y Transferencia bancaria siguen funcionando.

---

## Verificar que funcione con la app React

1. En WooCommerce, el método de pago (Visa Acceptance Solutions o Pagegate) debe estar **Activo**.
2. En la tienda (o en la app), agregá un producto al carrito y llegá hasta el checkout.
3. Deberías ver la opción de pago con tarjeta (Visa/Mastercard o Pagegate).
4. Después de pagar, si configuraste las URLs de retorno, deberías terminar en `api.royriff.com.ar/compra-confirmada`.

Si algo de esto no coincide con lo que ves en tu panel (por ejemplo, otro nombre de gateway), decime exactamente cómo se llama el método en **Pagos** y te digo los pasos concretos para ese plugin.
