/**
 * Roy Riff — Tracking de eventos del funnel (Meta Pixel + CAPI)
 *
 * Helpers que disparan eventos hacia el Meta Pixel ya inicializado por el plugin
 * "Facebook for WooCommerce". Cada evento incluye un `eventID` único que sirve
 * para deduplicación con CAPI server-side (Fase B).
 *
 * Si `fbq` no está disponible (ej: dev local sin pixel inyectado, ad blocker,
 * loading inicial), las funciones simplemente no hacen nada — no rompen el flujo.
 *
 * Eventos cubiertos:
 * - PageView: lo dispara automáticamente el plugin de WC, no se replica acá.
 * - ViewContent: ProductDetail.jsx
 * - AddToCart: ProductElegir.jsx (handleAddToCart)
 * - InitiateCheckout: CartDrawer.jsx (handleGoToCheckout)
 * - Purchase: CheckoutPago.jsx (después de createOrder exitoso)
 * - Lead: clicks de WhatsApp en el sitio
 *
 * Datos enviados (cuando aplica):
 * - value: monto en pesos
 * - currency: 'ARS' siempre
 * - content_ids: [string] product slug o ID
 * - content_name: nombre del producto
 * - content_type: 'product'
 * - num_items: cantidad de items en carrito
 * - eventID: UUID para deduplicación con CAPI
 */

const CURRENCY = 'ARS';

/** Genera un UUID v4 simple (suficiente para deduplicación de eventos). */
const generateEventId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback simple (no cripto-seguro pero suficiente para event IDs)
  return 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
};

/** Verifica que el Pixel esté disponible. */
const isFbqReady = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

/**
 * Envía el evento server-side al endpoint CAPI custom del plugin Roy Riff.
 * Falla silenciosamente si el endpoint no existe o el token no está configurado.
 */
const sendCAPI = (eventName, params, eventID) => {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      event_name: eventName,
      event_id: eventID,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: window.location.href,
      user_data: {
        client_user_agent: navigator.userAgent,
        // El plugin PHP completa con _fbp, _fbc, IP del cliente, hashed email/phone si los tiene
      },
      custom_data: params || {},
    };
    // Fire-and-forget. No esperamos response porque CAPI puede tardar.
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // permite que la request sobreviva el unmount/navigation
    }).catch(() => { /* silent */ });
  } catch (err) {
    // silent
  }
};

/**
 * Helper genérico — dispara un evento de Pixel + envía a CAPI.
 * Si el pixel no está, solo intenta CAPI.
 */
export const trackEvent = (eventName, params = {}) => {
  const eventID = generateEventId();
  if (isFbqReady()) {
    try {
      window.fbq('track', eventName, params, { eventID });
    } catch (err) {
      // silent
    }
  }
  sendCAPI(eventName, params, eventID);
  return eventID;
};

/**
 * ViewContent — usuario vio una ficha de producto.
 *
 * @param {object} product Producto desde productData o WC API.
 *   Espera: { slug, name, displayName, price, pricing }
 */
export const trackViewContent = (product) => {
  if (!product) return;
  const slug = product.slug || '';
  const name = product.displayName || product.name || '';
  const price = Number(product.price || product.pricing?.efectivo || 0);
  return trackEvent('ViewContent', {
    content_ids: [slug],
    content_name: name,
    content_type: 'product',
    value: price,
    currency: CURRENCY,
  });
};

/**
 * AddToCart — usuario agregó un producto al carrito.
 *
 * @param {object} product
 * @param {number} quantity
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  const slug = product.slug || '';
  const name = product.displayName || product.name || '';
  const price = Number(product.price || product.pricing?.efectivo || 0);
  return trackEvent('AddToCart', {
    content_ids: [slug],
    content_name: name,
    content_type: 'product',
    value: price * Number(quantity || 1),
    currency: CURRENCY,
    num_items: Number(quantity || 1),
  });
};

/**
 * InitiateCheckout — usuario llegó al inicio del checkout.
 *
 * @param {Array} cartItems lista de items del carrito Redux
 */
export const trackInitiateCheckout = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return;
  const totalValue = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const numItems = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );
  const contentIds = cartItems.map((i) => i.slug || String(i.id || ''));
  return trackEvent('InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    value: totalValue,
    currency: CURRENCY,
    num_items: numItems,
  });
};

/**
 * Purchase — orden creada exitosamente.
 *
 * @param {object} order respuesta de createOrder (id, total, line_items)
 * @param {Array} cartItems backup por si la order no trae el detalle
 */
export const trackPurchase = (order, cartItems = []) => {
  if (!order) return;
  const orderTotal = Number(order.total || 0);
  const orderId = order.id || order.number || '';
  // Construir content_ids desde line_items (preferido) o cartItems
  let contentIds = [];
  let contentNames = [];
  let numItems = 0;
  if (Array.isArray(order.line_items) && order.line_items.length > 0) {
    contentIds = order.line_items.map((li) => String(li.product_id || ''));
    contentNames = order.line_items.map((li) => li.name || '');
    numItems = order.line_items.reduce((sum, li) => sum + (Number(li.quantity) || 1), 0);
  } else if (Array.isArray(cartItems) && cartItems.length > 0) {
    contentIds = cartItems.map((i) => i.slug || String(i.id || ''));
    contentNames = cartItems.map((i) => i.displayName || i.name || '');
    numItems = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
  }
  return trackEvent('Purchase', {
    content_ids: contentIds,
    content_name: contentNames.filter(Boolean).join(' + '),
    content_type: 'product',
    value: orderTotal,
    currency: CURRENCY,
    num_items: numItems,
    order_id: String(orderId),
  });
};

/**
 * Lead — usuario hizo click en un botón de WhatsApp.
 *
 * @param {string} contextLabel optional: 'test_ride', 'consulta_compra', 'soporte', etc.
 */
export const trackLead = (contextLabel = 'whatsapp_click') => {
  return trackEvent('Lead', {
    content_name: contextLabel,
    content_category: 'whatsapp',
  });
};

/**
 * Inicializa un listener global delegado que detecta clicks en cualquier link
 * de WhatsApp (wa.me o api.whatsapp.com) en cualquier parte del SPA y dispara
 * Lead automáticamente. Llamar una vez al montar la app.
 *
 * Infiere el contexto a partir de la URL (path) del cliente o atributos data-track.
 */
export const initWhatsAppTracking = () => {
  if (typeof document === 'undefined') return;
  if (document.__rrWaTrackingInited) return;
  document.__rrWaTrackingInited = true;

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!target || typeof target.closest !== 'function') return;
      const anchor = target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) return;

      // Inferir contexto desde la ruta actual del SPA
      const path = (typeof window !== 'undefined' && window.location?.pathname) || '';
      let context = 'whatsapp_click';
      if (path.includes('/checkout')) context = 'checkout_consulta';
      else if (path.includes('/test-ride')) context = 'test_ride';
      else if (path.includes('/local')) context = 'local_consulta';
      else if (path.includes('/galeria')) context = 'galeria_consulta';
      else if (path.includes('/contacto')) context = 'contacto';
      else if (path.includes('/bicicletas-electricas/')) context = 'producto_consulta';
      else if (path === '/' || path === '') context = 'home_consulta';

      // Override por data attribute (si el link declara data-track-context="X")
      const overrideContext = anchor.getAttribute('data-track-context');
      if (overrideContext) context = overrideContext;

      trackLead(context);
    },
    { passive: true }
  );
};
