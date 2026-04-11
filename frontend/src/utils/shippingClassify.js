/**
 * Clasificación de métodos de envío devueltos por WooCommerce (Andreani, local pickup, etc.)
 * para no duplicar "retiro en el local" y separar domicilio vs sucursal del transporte.
 */

/**
 * Tarifa WC que es el mismo "retiro en Roy Riff / Yerba Buena" que ya mostramos arriba en UI.
 * Se excluye del listado al calcular por CP para no confundir con envío a otra provincia.
 */
export function isDuplicateStorePickupRate(option) {
  if (!option) return false;
  const id = String(option.id || option.method_id || '').toLowerCase();
  if (id.startsWith('local_pickup')) return true;
  const t = (option.title || '').toLowerCase();
  if (t.includes('recogida') && (t.includes('roy riff') || t.includes('yerba buena'))) return true;
  if (t.includes('retiro en el local') || t.includes('retiro local')) return true;
  if ((t.includes('roy riff') || t.includes('yerba buena')) && (t.includes('recogida') || t.includes('retiro'))) {
    return true;
  }
  return false;
}

/**
 * Retiro en sucursal del transporte (ej. Andreani sucursal / PDS), no el local de la tienda.
 * Heurística por título (ES/EN) y por id de método típico de plugins Andreani en WC.
 */
export function isCarrierBranchPickup(option) {
  if (!option || isDuplicateStorePickupRate(option)) return false;
  const id = String(option.id || option.method_id || '').toLowerCase();
  const t = (option.title || '').toLowerCase();

  if (t.includes('sucursal')) return true;
  if (t.includes('punto de retiro')) return true;
  if (t.includes('retiro en sucursal')) return true;
  if (t.includes('ship to branch') || t.includes('pick up point') || t.includes('pickup point')) return true;

  // Andreani: a domicilio suele decir "Domicilio" / "Puerta"; sucursal suele nombrar sucursal/PDS/branch
  if (/\bandreani\b/.test(t)) {
    if (/\b(sucursal|branch|pick\s*up|pickup|pds|punto)\b/.test(t)) return true;
    if (/\b(domicilio|puerta|a domicilio|door|home\s*delivery)\b/.test(t)) return false;
  }

  if (id.includes('andreani')) {
    if (
      id.includes('sucursal') ||
      id.includes('branch') ||
      id.includes('pickup') ||
      id.includes('pick_up') ||
      id.includes('pds') ||
      id.includes('suc_') ||
      id.includes(':suc')
    ) {
      return true;
    }
  }

  return false;
}

/** Envío a domicilio / puerta (Andreani a domicilio, flat rate, etc.) — excluye retiro en sucursal correo */
export function isDoorDeliveryOption(option) {
  if (!option || isDuplicateStorePickupRate(option)) return false;
  return !isCarrierBranchPickup(option);
}

/**
 * Retiro en el local físico de la tienda (card estática o tarifa WC equivalente).
 * Importante: NO incluye sucursal Andreani — el cliente debe completar dirección para eso.
 */
export function isStoreLocalPickup(option) {
  if (!option) return false;
  if (option._isStatic && String(option.id) === 'local_pickup') return true;
  return isDuplicateStorePickupRate(option);
}

/** Cualquier modalidad "retiro" (local tienda o sucursal transporte) — solo para etiquetas */
export function isPickupOption(option) {
  return isStoreLocalPickup(option) || isCarrierBranchPickup(option);
}

export function filterDuplicateStoreRates(options) {
  return (options || []).filter((o) => !isDuplicateStorePickupRate(o));
}

/**
 * Tipo de cumplimiento para meta en la orden (WooCommerce / operaciones).
 * No es solo UI: se persiste vía royriff_fulfillment en el payload saneado.
 */
export function getFulfillmentKind(option) {
  if (!option || typeof option !== 'object') return 'unknown';
  if (isStoreLocalPickup(option)) return 'store_pickup';
  if (isCarrierBranchPickup(option)) return 'carrier_branch_pickup';
  return 'door_delivery';
}
