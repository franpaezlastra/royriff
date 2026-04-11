import { describe, it, expect } from 'vitest';
import {
  isStoreLocalPickup,
  isCarrierBranchPickup,
  isDoorDeliveryOption,
  isPickupOption,
  getFulfillmentKind,
  filterDuplicateStoreRates,
} from './shippingClassify';

describe('isStoreLocalPickup', () => {
  it('tarifa estática del drawer / carrito', () => {
    expect(
      isStoreLocalPickup({
        id: 'local_pickup',
        method_id: 'local_pickup',
        _isStatic: true,
      })
    ).toBe(true);
  });

  it('id WooCommerce local_pickup:instancia', () => {
    expect(
      isStoreLocalPickup({
        id: 'local_pickup:2',
        method_id: 'local_pickup:2',
        title: 'Recogida local',
      })
    ).toBe(true);
  });

  it('no confunde sucursal Andreani con local tienda', () => {
    expect(
      isStoreLocalPickup({
        id: 'andreani_envios:99',
        title: 'Andreani — Retiro en sucursal',
      })
    ).toBe(false);
  });
});

describe('isCarrierBranchPickup', () => {
  it('detecta por palabra sucursal', () => {
    expect(isCarrierBranchPickup({ title: 'Envío a sucursal OCA', id: 'x' })).toBe(true);
  });

  it('Andreani domicilio no es sucursal', () => {
    expect(
      isCarrierBranchPickup({
        title: 'Andreani — Envío a domicilio',
        id: 'andreani_domicilio:1',
      })
    ).toBe(false);
  });

  it('Andreani sucursal por título', () => {
    expect(
      isCarrierBranchPickup({
        title: 'Andreani — Retiro en sucursal',
        id: 'z',
      })
    ).toBe(true);
  });

  it('Andreani + branch en inglés', () => {
    expect(
      isCarrierBranchPickup({
        title: 'Andreani ship to branch',
        id: 'a',
      })
    ).toBe(true);
  });

  it('no clasifica retiro en local tienda como sucursal correo', () => {
    expect(isCarrierBranchPickup({ id: 'local_pickup', title: 'Retiro en el local' })).toBe(false);
  });
});

describe('isDoorDeliveryOption', () => {
  it('flat rate genérico es domicilio', () => {
    expect(isDoorDeliveryOption({ id: 'flat_rate:1', title: 'Estándar' })).toBe(true);
  });

  it('sucursal no es domicilio', () => {
    expect(isDoorDeliveryOption({ id: 'f', title: 'Punto de retiro sucursal X' })).toBe(false);
  });
});

describe('getFulfillmentKind', () => {
  it('local tienda → store_pickup', () => {
    expect(
      getFulfillmentKind({ id: 'local_pickup', _isStatic: true })
    ).toBe('store_pickup');
  });

  it('sucursal transporte → carrier_branch_pickup', () => {
    expect(getFulfillmentKind({ title: 'Retiro sucursal Andreani' })).toBe('carrier_branch_pickup');
  });

  it('domicilio → door_delivery', () => {
    expect(getFulfillmentKind({ title: 'Andreani a domicilio', id: 'x' })).toBe('door_delivery');
  });

  it('sin opción → unknown', () => {
    expect(getFulfillmentKind(null)).toBe('unknown');
  });
});

describe('isPickupOption', () => {
  it('incluye local y sucursal correo', () => {
    expect(isPickupOption({ id: 'local_pickup', _isStatic: true })).toBe(true);
    expect(isPickupOption({ title: 'Sucursal correo' })).toBe(true);
    expect(isPickupOption({ title: 'Domicilio' })).toBe(false);
  });
});

describe('filterDuplicateStoreRates', () => {
  it('quita local_pickup del listado por CP cuando hay duplicado conceptual', () => {
    const opts = [
      { id: 'local_pickup:1', title: 'Recogida' },
      { id: 'flat_rate:2', title: 'A domicilio' },
    ];
    const f = filterDuplicateStoreRates(opts);
    expect(f.some((o) => String(o.id).startsWith('local_pickup'))).toBe(false);
    expect(f.some((o) => o.id === 'flat_rate:2')).toBe(true);
  });
});
