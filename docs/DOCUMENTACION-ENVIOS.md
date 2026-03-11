# Documentación completa: Envíos (Roy Riff – WooCommerce + React)

Todo lo relacionado con envíos en el proyecto: cómo funciona, dónde está el código, cómo configurar WooCommerce y opciones para Argentina. Referencia única para consultar después.

---

## 1. Resumen del sistema de envíos en este proyecto

- **Frontend (React):** El usuario ingresa código postal (y opcional ciudad/provincia). Se llama al backend para obtener opciones de envío con precio. Esas opciones se muestran en un calculador reutilizable y el total se actualiza con el costo de envío.
- **Backend (plugin WordPress):** El endpoint `POST /api/shipping/calculate` recibe código postal y productos del carrito, crea una orden temporal en WooCommerce para que calcule métodos según las zonas de envío configuradas, devuelve las opciones (id, título, costo) y borra la orden temporal.
- **WooCommerce:** Es la fuente de verdad. Las zonas de envío y los métodos (precio fijo, envío gratis, etc.) se configuran en **WooCommerce → Ajustes → Envío**. Sin configuración ahí, el calculador no tendrá opciones útiles (o devolverá fallback genérico).

No hay integración directa con Correo Argentino o Andreani en el código: eso se agrega con plugins de WooCommerce si se quieren tarifas en tiempo real.

---

## 2. Archivos involucrados

| Qué | Dónde |
|-----|--------|
| Componente calculador (CP, ciudad, provincia, botón “Calcular envío”, lista de opciones) | `frontend/src/components/shipping/ShippingCalculator.jsx` |
| Llamada al API de cálculo de envío | `frontend/src/services/woocommerceService.js` → `calculateShipping()` |
| Uso del calculador en Carrito | `frontend/src/pages/Carrito/Carrito.jsx` (importa `ShippingCalculator`, estado `selectedShipping`, total con envío) |
| Uso en Checkout (cálculo automático al ingresar CP) | `frontend/src/pages/Checkout/Checkout.jsx` (useEffect con debounce, `handleCalculateShipping`, `selectedShipping`, `shipping_lines` en la orden) |
| Endpoint que calcula envío | `royriff-app-temp/includes/class-royriff-api.php` → método `calculate_shipping()`, ruta `POST /api/shipping/calculate` |

---

## 3. Flujo técnico

1. Usuario escribe código postal (en Carrito: en el calculador; en Checkout: en el campo de facturación/envió).
2. **Carrito:** al hacer clic en “Calcular envío” se llama `calculateShipping({ postcode, city, state, line_items })`.  
   **Checkout:** tras 1 segundo sin cambiar el CP se llama lo mismo con los datos del formulario.
3. Frontend hace `POST /api/shipping/calculate` con `{ postcode, city?, state?, line_items }`.
4. Plugin PHP: crea orden temporal en WooCommerce con esa dirección y productos; obtiene la orden completa; extrae `shipping_lines` o, si no hay, consulta `shipping/zones` y `shipping/zones/{id}/methods` para armar opciones; borra la orden temporal; responde `{ postcode, options: [{ id, title, cost, method_id }] }`.
5. Frontend muestra las opciones; el usuario puede elegir una. El total (Carrito y Checkout) se actualiza con `selectedShipping.cost`.
6. Al crear la orden en Checkout, se envían `shipping_lines` con el método elegido para que WooCommerce guarde el envío en la orden.

---

## 4. Configuración de envíos en WooCommerce (paso a paso)

Todo esto se hace en el panel de WordPress, sin tocar código.

### 4.1 Entrar a Envío

1. Panel de WordPress → menú izquierdo **WooCommerce**.
2. **Ajustes** (o **Configuración**).
3. Pestaña **Envío**.

### 4.2 Activar envío

- En la parte superior, activar la opción tipo **“Habilitar envío”** / **“Enable shipping”** si existe.
- **Guardar cambios** si modificaste algo.

### 4.3 Crear zona “Argentina”

1. En **Zonas de envío**, clic en **“Añadir zona de envío”**.
2. **Nombre de la zona:** por ejemplo `Argentina`.
3. **Regiones de la zona:** clic en “Añadir regiones” / búsqueda → escribir **Argentina** → elegir **Argentina**.
4. **Limitación por código postal:** dejar en blanco para todo el país. Si solo querés ciertos CP (ej. CABA), podés poner `1000, 1001, 1002` o rango `1000...1499`.
5. **Guardar cambios** en esa zona.

### 4.4 Agregar métodos a la zona Argentina

1. Dentro de la zona **Argentina**, sección **“Métodos de envío”**.
2. **“Añadir método de envío”**.
3. Elegir **“Precio fijo”** → **“Añadir método de envío”**.
4. Clic en el nombre del método (ej. “Precio fijo”) para editarlo:
   - **Título:** ej. `Envío a domicilio (Argentina)`.
   - **Coste:** ej. `5000` (sin separador de miles; decimal con punto si aplica).
   - **Impuestos:** según corresponda (a menudo “No”).
5. **Guardar cambios**.
6. (Opcional) Volver a **“Añadir método de envío”** → **“Envío gratuito”**:
   - Título ej. `Envío gratis`.
   - Si hay “Cantidad mínima”, poner el monto a partir del cual es gratis (ej. `500000`).
7. **Guardar cambios**.

### 4.5 (Opcional) Zona solo CABA u otra región

1. **“Añadir zona de envío”**.
2. Nombre: ej. `CABA`.
3. Regiones: **Ciudad Autónoma de Buenos Aires** (y si querés **Buenos Aires** para GBA).
4. Añadir método **Precio fijo** con otro coste (ej. más barato).
5. **Guardar cambios**.

Importante: WooCommerce usa la primera zona que coincida. Si tenés “Argentina” y “CABA”, poné la más específica (CABA) arriba en la lista (arrastrando).

### 4.6 Revisar datos generales del negocio

- **WooCommerce → Ajustes → General**: dirección del negocio (país Argentina, ciudad/provincia), moneda (ej. ARS). Guardar si cambiaste algo.

Con esto el calculador puede devolver opciones con los precios que definiste.

---

## 5. Cómo se manejan envíos en otras plataformas (referencia)

- **WooCommerce:** Trae zonas + precio fijo, envío gratis, recogida. Correo Argentino / Andreani **no** vienen integrados; se agregan con **plugins** (ej. Carriers of Argentina for WooCommerce, Andreani WooCommerce).
- **Shopify:** Zonas y tarifas que definís; transportistas argentinos con **apps** (Correo Argentino, Andreani, etc.).
- **Tiendanube:** Tiene **Envío Nube** integrado (Correo Argentino y Andreani con sus tarifas). No es un plugin externo.

En este proyecto estamos en WooCommerce: base con zonas y métodos nativos; si más adelante querés tarifas en tiempo real de Correo/Andreani, se hace instalando y configurando un plugin de envíos para Argentina.

---

## 6. Plugins opcionales para Argentina (Correo Argentino, Andreani)

Si más adelante querés cotización en tiempo real y/o etiquetas:

- **Carriers of Argentina for WooCommerce** (Correo Argentino, OCA, Andreani en un solo plugin; suele ser de pago).
- **Andreani WooCommerce** (solo Andreani).
- **Paq.ar / Correo Argentino** (plugins o desarrollos que integren la API de Correo Argentino).

Se instalan y configuran en WordPress. Los métodos que agreguen aparecerán en las zonas de envío y el mismo calculador y endpoint `/api/shipping/calculate` pueden usarlos (WooCommerce sigue siendo la fuente de verdad).

---

## 7. Usar el calculador en otra página

El componente es reutilizable. Ejemplo para una página de producto o “Envíos”:

```jsx
import ShippingCalculator from '../components/shipping/ShippingCalculator';

// Con productos del carrito (por defecto)
<ShippingCalculator
  onShippingSelected={(option) => console.log(option)}
  showTitle={true}
/>

// Con productos custom (ej. un solo ítem)
<ShippingCalculator
  customItems={[{ id: 123, product_id: 123, quantity: 1 }]}
  onShippingSelected={(option) => setSelected(option)}
  showTitle={false}
  className="mt-4"
/>
```

Props: `onShippingSelected` (callback con `{ id, title, cost, method_id }`), `showTitle`, `className`, `customItems` (si no se pasa, usa el carrito de Redux).

---

## 8. API del endpoint de cálculo

- **Método y ruta:** `POST /api/shipping/calculate`
- **Body (JSON):**
  - `postcode` (string, obligatorio)
  - `city` (string, opcional)
  - `state` (string, opcional)
  - `line_items` (array, obligatorio): `[{ product_id: number, quantity: number }]`
- **Respuesta correcta:** `{ postcode: string, options: [{ id, title, cost, method_id }] }`
- **Errores:** 400 si falta `postcode` o `line_items`; 500 si falla la creación/consulta de la orden temporal o WooCommerce.

---

Con esto tenés todo el tema de envíos documentado en un solo lugar: flujo, archivos, configuración en WooCommerce paso a paso, comparativa de plataformas y uso del calculador en otras páginas.
