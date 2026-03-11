# Cómo se manejan los envíos en las tiendas (Argentina)

Resumen de cómo vienen los envíos en las plataformas más usadas y qué tenés que hacer en tu caso (WooCommerce + React).

---

## 1. ¿Vienen integrados o se hace por aparte?

**Respuesta corta:** En **ninguna** plataforma grande (WooCommerce, Shopify, Tiendanube) vienen “de fábrica” Correo Argentino o Andreani con cotización en tiempo real. Siempre es una de estas dos cosas:

- La plataforma trae **solo la base** (zonas, precio fijo, envío gratis) y vos agregás **plugins/apps** para cada transportista, **o**
- La plataforma ofrece **un servicio propio** que ya habla con esos transportistas (como Envío Nube en Tiendanube).

O sea: o lo configurás por aparte con plugins/apps, o usás el “envío integrado” que ofrece la plataforma (si existe).

---

## 2. Cómo es en cada plataforma

### WooCommerce

- **Qué trae por defecto (sin plugins):**
  - Zonas de envío (por país, provincia, código postal).
  - Métodos básicos: **precio fijo**, **envío gratuito**, **recogida en local**.
  - No trae Correo Argentino, Andreani ni OCA integrados.

- **Cómo se agregan Correo Argentino / Andreani:**  
  Se hace **por aparte**, instalando plugins. Algunos ejemplos:
  - **Carriers of Argentina for WooCommerce** (Correo Argentino, OCA, Andreani en un solo plugin; suele ser de pago).
  - **Andreani WooCommerce** (solo Andreani).
  - **Paq.ar / Correo Argentino** (plugins o desarrollos que integran con la API de Correo Argentino).

En resumen: en WooCommerce los envíos “postales” se manejan **con plugins adicionales**, no vienen predeterminados.

---

### Shopify

- **Qué trae por defecto:**  
  Envío por zonas y tarifas que vos definís (precio fijo, por peso, etc.). No trae transportistas argentinos integrados.

- **Cómo se agregan:**  
  Con **apps** desde la App Store de Shopify:
  - App de **Correo Oficial de la República Argentina**.
  - Apps de **Andreani** (por ejemplo la de Grupo Logístico Andreani).
  - Otras apps de logística (AfterShip, etc.) que conectan con esos transportistas.

O sea: tampoco vienen integrados; se agregan **por aparte** con apps.

---

### Tiendanube (Nube)

- **Qué trae “integrado”:**  
  Tienen **Envío Nube**: un servicio de la propia Tiendanube que ya habla con **Correo Argentino** y **Andreani**, con tarifas que ellos negocian. Lo activás desde el panel (Configuración > Medios de envío > Envío Nube).

- **Cómo funciona:**  
  No instalás un plugin externo: es una función de la plataforma. Vos configurás centro de distribución, activás Envío Nube y la tienda muestra opciones de envío y precios según ese servicio.

Aquí sí hay algo “más integrado”, pero es un **servicio de Tiendanube**, no algo que WooCommerce o Shopify tengan igual de caja.

---

## 3. Tabla resumen

| Plataforma   | ¿Envíos “de fábrica”? | ¿Correo Argentino / Andreani? | Cómo se agregan |
|-------------|------------------------|--------------------------------|------------------|
| **WooCommerce** | Sí (zonas + precio fijo, gratis, recogida) | No | Plugins por aparte (ej. Carriers of Argentina, Andreani, etc.) |
| **Shopify** | Sí (zonas + tarifas que definís) | No | Apps por aparte (Correo Argentino, Andreani, etc.) |
| **Tiendanube** | Sí + **Envío Nube** (servicio propio) | Sí, vía Envío Nube | Integrado en la plataforma; no es un plugin externo |

Conclusión: **no vienen integrados** en WooCommerce ni Shopify; en ambos se hace **por aparte** con plugins/apps. Tiendanube es la que tiene algo “integrado” (Envío Nube).

---

## 4. En tu proyecto (WooCommerce + React)

Vos estás con **WooCommerce**, así que el camino es el mismo que cualquier tienda Woo en Argentina:

1. **Base (ya la tenés):**  
   Zonas de envío y métodos que WooCommerce trae (precio fijo, envío gratis). El calculador que armamos usa eso: si en WooCommerce tenés métodos configurados por zona/código postal, el endpoint `/api/shipping/calculate` puede devolver esas opciones.

2. **Para Correo Argentino / Andreani “posta” (cotización en tiempo real, etiquetas, etc.):**  
   Tenés que instalar y configurar **plugins por aparte**, igual que en cualquier WooCommerce:
   - Un plugin tipo **Carriers of Argentina for WooCommerce** (varios transportistas), **o**
   - Un plugin solo **Andreani** y otro solo **Correo Argentino** (o Paq.ar), según lo que uses.

3. **Alternativa sin API de transportistas:**  
   Podés no usar ningún plugin de Correo/Andreani y trabajar solo con:
   - Zonas de envío en WooCommerce (por provincia o por códigos postales).
   - Métodos “Precio fijo” o “Envío gratuito” por zona.  
   El calculador que tenemos seguiría mostrando esas opciones; los precios los definís vos en WooCommerce.

---

## 5. Qué hacer según tu caso

- **“Quiero que se vea el costo de envío por código postal”**  
  - Con **solo WooCommerce:** configurá zonas por provincia o por código postal y métodos de precio fijo (o gratis). El calculador ya puede usar eso.  
  - Con **tarifas en tiempo real** de Correo Argentino/Andreani: tenés que instalar y configurar un **plugin de envíos para Argentina** (por aparte).

- **“No quiero instalar nada extra por ahora”**  
  - Usá solo **WooCommerce > Ajustes > Envío**: creá una zona “Argentina”, agregá un método “Precio fijo” (o varios por provincia) y opcionalmente “Envío gratuito” para montos altos. El calculador mostrará lo que WooCommerce devuelva para ese código postal.

- **“Quiero Andreani / Correo Argentino como en Tiendanube”**  
  - En WooCommerce no hay un “Envío Nube” integrado. Hay que usar **plugins** (de pago o gratuitos) que conecten con esas APIs; eso sí es “por aparte”.

Si querés, en el siguiente paso podemos bajar esto a pasos concretos en tu WordPress (dónde crear la zona, qué método agregar y cómo probar el calculador con eso).