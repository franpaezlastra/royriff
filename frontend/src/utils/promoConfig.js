/**
 * Configuración centralizada de promociones temporales.
 *
 * Para activar / desactivar la Hot Sale: cambiar `HOT_SALE.active` a `true` / `false`.
 * Después del evento, todo vuelve automáticamente al pricing normal.
 *
 * Acción del user en WP Admin durante Hot Sale:
 *   1. LOLA Cruiser: precio normal $2.412.000 → $2.310.000
 *   2. XXXX Expedition: precio normal $3.217.000 → $3.208.000
 *   3. Plugin BACS discount:
 *        - LOLA: $412.000 → $510.000
 *        - XXXX: $517.000 → $708.000
 *   4. MP: confirmar que la promo de 3 cuotas y 6 cuotas sin interés esté configurada.
 */

export const HOT_SALE = {
  active: true,
  startDate: '2026-05-11T08:00:00-03:00', // Lunes 11 May 08:00 ART
  endDate:   '2026-05-13T23:59:59-03:00', // Miércoles 13 May 23:59 ART
  label: 'HOT SALE',
  badge: '3 DÍAS',
  countdownLabel: 'HASTA EL MIÉRCOLES',
  pricing: {
    'lola-cruiser': {
      efectivo: 1800000,
      cuota6: 385000,
      cuota6Total: 2310000,
      cuota3: 722667,
      cuota3Total: 2168000,
      precioRegular: 2000000, // Para mostrar tachado (era el efectivo normal)
      ahorroEfectivo: 200000,
    },
    'xxxx-expedition': {
      efectivo: 2500000,
      cuota6: 534667,
      cuota6Total: 3208000,
      cuota3: 1003333,
      cuota3Total: 3010000,
      precioRegular: 2700000,
      ahorroEfectivo: 200000,
    },
  },
};

/**
 * Determina si la Hot Sale está activa AHORA según fecha actual + flag manual.
 * El flag `active` triunfa sobre las fechas (permite previsualización o extensión rápida).
 */
export const isHotSaleActive = () => {
  if (!HOT_SALE.active) return false;
  try {
    const now = Date.now();
    const start = new Date(HOT_SALE.startDate).getTime();
    const end = new Date(HOT_SALE.endDate).getTime();
    return now >= start && now <= end;
  } catch {
    return HOT_SALE.active;
  }
};

/**
 * Devuelve el pricing override de Hot Sale para un producto, o null si no aplica.
 * @param {string} slug 'lola-cruiser' | 'xxxx-expedition' | etc.
 */
export const getHotSalePricing = (slug) => {
  if (!isHotSaleActive()) return null;
  return HOT_SALE.pricing[slug] || null;
};
