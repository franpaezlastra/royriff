import { formatPrice } from '../../utils/constants';

/**
 * Bloque de precio del PDP — modelo dual MP / Transferencia.
 *
 * Variante normal:
 *   - Precio de lista grande (= 6 cuotas sin interés total).
 *   - "6 cuotas sin interés de $X con tarjeta de crédito".
 *   - Ahorro por transferencia (badge verde) + precio efectivo.
 *
 * Variante Hot Sale (cuando product.pricing.isHotSale === true):
 *   - Badge "HOT SALE · 3 DÍAS" naranja.
 *   - Precio efectivo nuevo destacado + precio regular tachado.
 *   - "Ahorrás $200.000 con transferencia" más prominente.
 *   - 6 cuotas SIN INTERÉS con la cuota Hot Sale.
 *   - 3 cuotas con CFT aplicable (chico, abajo).
 */
const ProductPriceBlock = ({ product }) => {
  const pricing = product?.pricing;
  if (!pricing) return null;

  const isHotSale = pricing.isHotSale === true;
  const listPrice = product?.price || pricing?.efectivo;
  if (!listPrice) return null;

  if (isHotSale) {
    return <HotSaleVariant pricing={pricing} />;
  }

  return <NormalVariant pricing={pricing} listPrice={listPrice} />;
};

const NormalVariant = ({ pricing, listPrice }) => {
  const { efectivo, cuota6, ahorro } = pricing;
  return (
    <div className="bg-primary-beige rounded-lg p-6 md:p-7 mb-6 max-w-lg">
      <p className="font-barlow font-black text-3xl md:text-4xl text-primary-orange leading-tight tracking-tight">
        {formatPrice(listPrice)}
      </p>
      <p className="font-neue text-neutral-black text-sm md:text-base mt-2">
        en <strong>6 cuotas sin interés</strong> de {formatPrice(cuota6)} con tarjeta de crédito
      </p>
      {ahorro ? (
        <div className="border-t border-neutral-gray/25 mt-4 pt-4">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 mb-2">
            <span className="font-barlow font-black text-sm uppercase text-green-800 tracking-wide">
              Ahorrás {formatPrice(ahorro)}
            </span>
          </div>
          <p className="font-neue text-sm text-neutral-black">
            pagando con <strong>transferencia bancaria</strong>: {formatPrice(efectivo)}
          </p>
          <p className="font-neue text-xs text-neutral-gray mt-1 leading-relaxed">
            El descuento se aplica automáticamente al elegir transferencia en el pago.
          </p>
        </div>
      ) : null}
    </div>
  );
};

const HotSaleVariant = ({ pricing }) => {
  const {
    efectivo,
    cuota6,
    cuota3,
    cuota3Total,
    precioRegular,
    ahorroEfectivo,
  } = pricing;

  return (
    <div className="relative bg-primary-beige rounded-xl p-6 md:p-7 mb-6 max-w-lg border-2 border-primary-orange/40 shadow-sm">
      {/* Badge Hot Sale */}
      <div className="absolute -top-3 left-5 inline-flex items-center gap-2 bg-primary-orange text-white px-3 py-1 rounded-full shadow-md">
        <span className="font-barlow font-black text-[11px] tracking-[0.18em] uppercase">
          🔥 Hot Sale · 3 días
        </span>
      </div>

      {/* Precio efectivo nuevo prominente */}
      <div className="mt-1">
        <p className="font-barlow font-black text-4xl md:text-5xl text-primary-orange leading-none tracking-tight">
          {formatPrice(efectivo)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-neue text-sm text-neutral-gray line-through">
            antes {formatPrice(precioRegular)}
          </span>
          {ahorroEfectivo ? (
            <span className="font-barlow font-bold text-xs uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
              -{formatPrice(ahorroEfectivo)}
            </span>
          ) : null}
        </div>
        <p className="font-neue text-sm text-neutral-black mt-2">
          con <strong>transferencia bancaria o efectivo</strong>
        </p>
      </div>

      <div className="border-t border-neutral-gray/25 mt-5 pt-4 space-y-3">
        {/* 6 cuotas sin interés */}
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="font-barlow font-black text-lg text-neutral-black leading-tight">
              {formatPrice(cuota6)}
              <span className="font-neue font-normal text-sm text-neutral-darkGreen ml-1">
                /mes
              </span>
            </p>
            <p className="font-neue text-xs text-neutral-darkGreen mt-0.5">
              en <strong>6 cuotas SIN INTERÉS</strong> con tarjeta
            </p>
          </div>
          <span className="font-barlow font-bold text-[10px] tracking-widest uppercase text-primary-orange bg-primary-orange/10 rounded px-2 py-1 shrink-0">
            Destacada
          </span>
        </div>

        {/* 3 cuotas con recargo */}
        <div>
          <p className="font-barlow font-bold text-base text-neutral-black leading-tight">
            {formatPrice(cuota3)}
            <span className="font-neue font-normal text-sm text-neutral-darkGreen ml-1">
              /mes
            </span>
          </p>
          <p className="font-neue text-xs text-neutral-darkGreen mt-0.5">
            en <strong>3 cuotas</strong> con tarjeta · total {formatPrice(cuota3Total)}
          </p>
        </div>
      </div>

      <p className="font-neue text-[11px] text-neutral-gray mt-4 leading-relaxed">
        Vigente hasta el miércoles 13/05 a las 23:59. CFT aplicable en pagos con tarjeta según
        medio de pago y entidad emisora.
      </p>
    </div>
  );
};

export default ProductPriceBlock;
