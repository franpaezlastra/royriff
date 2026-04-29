/** Misma opción que en CartDrawer / Checkout: retiro en el local, sin depender del CP */
export const LOCAL_PICKUP_OPTION = {
  id: 'local_pickup',
  method_id: 'local_pickup',
  title: 'Retiro en el local',
  cost: 0,
  _isStatic: true,
};

/** Envío gratis a todo el país — opción estática que no requiere calcular por CP. */
export const FREE_SHIPPING_OPTION = {
  id: 'free_shipping',
  method_id: 'free_shipping',
  title: 'Envío gratis a todo el país',
  cost: 0,
  _isStatic: true,
};
