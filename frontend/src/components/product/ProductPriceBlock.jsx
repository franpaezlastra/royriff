import { formatPrice } from '../../utils/constants';

/**
 * Bloque de precio — modelo dual MP / Transferencia.
 *
 * - Línea principal: precio de lista (= precio que se cobra en MP en 6 cuotas sin interés).
 * - Subtítulo: detalle de "6 cuotas sin interés con tarjeta de crédito".
 * - Bloque secundario: ahorro por transferencia bancaria (badge verde + monto con descuento).
 *
 * Espera `product.price` (precio de lista, viene de WC) + `product.pricing` con efectivo,
 * cuota6 y ahorro (hardcoded en productData.js).
 */
const ProductPriceBlock = ({ product }) => {
  const pricing = product?.pricing;
  const listPrice = product?.price || pricing?.efectivo;
  if (!pricing || !listPrice) return null;

  const { efectivo, cuota6, ahorro } = pricing;

  return (
    <div className="bg-primary-beige rounded-lg p-6 md:p-7 mb-6 max-w-lg">
      {/* Precio de lista prominente */}
      <p className="font-barlow font-black text-3xl md:text-4xl text-primary-orange leading-tight tracking-tight">
        {formatPrice(listPrice)}
      </p>

      {/* Subtítulo: 6 cuotas sin interés con tarjeta */}
      <p className="font-neue text-neutral-black text-sm md:text-base mt-2">
        en <strong>6 cuotas sin interés</strong> de {formatPrice(cuota6)} con tarjeta de crédito
      </p>

      {/* Bloque ahorro por transferencia */}
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

export default ProductPriceBlock;
