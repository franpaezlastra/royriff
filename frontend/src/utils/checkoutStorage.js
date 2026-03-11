/**
 * Helpers para persistir datos del checkout entre el carrito/drawer
 * y las páginas de entrega/pago usando localStorage.
 */

const KEYS = {
  SHIPPING: 'royriff_checkout_shipping',
  BILLING: 'royriff_checkout_billing',
};

// ── Envío seleccionado ────────────────────────────────────────────────────────
export const saveCheckoutShipping = (option) => {
  try {
    localStorage.setItem(KEYS.SHIPPING, JSON.stringify(option));
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
};

// ── Helper: detectar si un método es retiro ──────────────────────────────────
export const isPickupOption = (option) => {
  if (!option) return false;
  const id = String(option.id || '');
  if (id === 'local_pickup' || id.startsWith('local_pickup:')) return true;
  const title = (option.title || '').toLowerCase();
  return (
    title.includes('retiro') ||
    title.includes('retirar') ||
    title.includes('sucursal') ||
    title.includes('punto de retiro') ||
    title.includes('pickup')
  );
};
