import { formatPrice } from '../../utils/constants';

const ProductPriceBlock = ({ product }) => {
  const pricing = product?.pricing;
  if (!pricing) return null;

  const { efectivo, cuota6, ahorro } = pricing;

  return (
    <div className="bg-primary-beige rounded-lg p-6 md:p-7 mb-6 max-w-lg">
      {/* Línea principal: 6 cuotas fijas */}
      <p className="font-barlow font-black text-3xl md:text-4xl text-neutral-black leading-tight tracking-tight uppercase">
        6 cuotas fijas de {formatPrice(cuota6)}
      </p>

      {/* Línea secundaria: efectivo + ahorro */}
      <p className="font-neue text-neutral-black text-base md:text-lg mt-2">
        o {formatPrice(efectivo)} en efectivo / transferencia
        {ahorro ? (
          <>
            {' — '}
            <span className="font-bold text-primary-orange">
              Ahorrás {formatPrice(ahorro)}
            </span>
          </>
        ) : null}
      </p>

      {/* Línea legal */}
      <p className="font-neue text-xs text-neutral-gray mt-3 leading-relaxed">
        Financiación también en 3, 9 o 12 cuotas. Todos los medios de pago
        habilitados por Mercado Pago. CFT aplicable según medio de pago elegido.
      </p>
    </div>
  );
};

export default ProductPriceBlock;
