/**
 * Helpers para persistir datos del checkout entre el carrito/drawer
 * y las páginas de entrega/pago usando localStorage.
 */

const KEYS = {
  SHIPPING: 'royriff_checkout_shipping',
  BILLING: 'royriff_checkout_billing',
  DELIVERY_CTX: 'royriff_checkout_delivery_ctx',
};

/** CP / ciudad usados al calcular envío en carrito o drawer (para hidratar checkout entrega) */
export const saveDeliveryContext = (ctx) => {
  try {
    localStorage.setItem(
      KEYS.DELIVERY_CTX,
      JSON.stringify({
        postcode: ctx.postcode || '',
        city: ctx.city || '',
        state: ctx.state || '',
      })
    );
  } catch (_) {}
};

export const loadDeliveryContext = () => {
  try {
    const raw = localStorage.getItem(KEYS.DELIVERY_CTX);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

export const clearDeliveryContext = () => {
  try {
    localStorage.removeItem(KEYS.DELIVERY_CTX);
  } catch (_) {}
};

// ── Envío seleccionado ────────────────────────────────────────────────────────
/** Solo campos planos: evita fallos de JSON.stringify y datos basura del objeto de tarifa WC */
export const saveCheckoutShipping = (option) => {
  try {
    if (!option || typeof option !== 'object') return;
    const id = String(option.id ?? option.method_id ?? '');
    const minimal = {
      id,
      method_id: String(option.method_id ?? option.id ?? id),
      title: String(option.title ?? ''),
      cost: typeof option.cost === 'number' ? option.cost : parseFloat(option.cost) || 0,
    };
    if (option._isStatic) minimal._isStatic = true;
    if (option.estimated_delivery) minimal.estimated_delivery = String(option.estimated_delivery);
    localStorage.setItem(KEYS.SHIPPING, JSON.stringify(minimal));
  } catch (_) {}
};

export const loadCheckoutShipping = () => {
  try {
    const raw = localStorage.getItem(KEYS.SHIPPING);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

export const clearCheckoutShipping = () => {
  try {
    localStorage.removeItem(KEYS.SHIPPING);
  } catch (_) {}
};

// ── Datos de facturación / envío ──────────────────────────────────────────────
export const saveCheckoutBilling = (data) => {
  try {
    localStorage.setItem(KEYS.BILLING, JSON.stringify(data));
  } catch (_) {}
};

export const loadCheckoutBilling = () => {
  try {
    const raw = localStorage.getItem(KEYS.BILLING);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

export const clearCheckoutBilling = () => {
  try {
    localStorage.removeItem(KEYS.BILLING);
  } catch (_) {}
};

// ── Limpiar todo el checkout ─────────────────────────────────────────────────
export const clearCheckoutStorage = () => {
  clearCheckoutShipping();
  clearCheckoutBilling();
  clearDeliveryContext();
};

/**
 * Al salir del checkout hacia el inicio (estilo Tiendanube): quita método de envío, CP guardado
 * y marca de retiro en billing persistido, sin borrar nombre/email del cliente.
 */
export const clearShippingCheckoutData = () => {
  clearCheckoutShipping();
  clearDeliveryContext();
  try {
    const b = loadCheckoutBilling();
    if (b && typeof b === 'object') {
      saveCheckoutBilling({
        ...b,
        billing_postcode: '',
        billing_is_pickup: false,
      });
    }
  } catch (_) {}
};

// ── Clasificación envío / retiro (ver shippingClassify.js) ─────────────────
export {
  isStoreLocalPickup,
  isPickupOption,
  isCarrierBranchPickup,
  isDoorDeliveryOption,
  filterDuplicateStoreRates,
} from './shippingClassify';
