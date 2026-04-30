import PRODUCT_DATA from './productData';

/**
 * Roy Riff — utilidades de descuento por transferencia bancaria (BACS)
 *
 * Modelo: el cliente que paga con transferencia recibe un descuento fijo por
 * producto (ahorro respecto del precio de lista publicado en MP). Los valores
 * tienen que mantenerse sincronizados con `royriff-app-temp/includes/bacs-discount.php`.
 *
 * Fuente de verdad: el campo `pricing.ahorro` de cada producto en productData.js.
 */

/** Devuelve el ahorro BACS de un producto por su slug. 0 si no aplica. */
export const getBacsDiscountBySlug = (slug) => {
  if (!slug) return 0;
  const data = PRODUCT_DATA[slug];
  return Number(data?.pricing?.ahorro || 0);
};

/** Calcula el ahorro BACS total de un carrito (suma item.ahorro × quantity). */
export const calculateCartBacsDiscount = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
  return cartItems.reduce((total, item) => {
    const slug = item.slug || '';
    const ahorro = getBacsDiscountBySlug(slug);
    const qty = Number(item.quantity || 1);
    return total + ahorro * qty;
  }, 0);
};
