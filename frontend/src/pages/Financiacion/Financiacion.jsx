import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import Countdown from '../../components/common/Countdown';
import { getEffectiveProduct } from '../../utils/productData';
import { formatPrice } from '../../utils/constants';
import { HOT_SALE, isHotSaleActive } from '../../utils/promoConfig';

const NORMAL_INSTALLMENTS = [
  { cuotas: 3, recargo: 11 },
  { cuotas: 6, recargo: 20 },
  { cuotas: 9, recargo: 33 },
  { cuotas: 12, recargo: 44 },
];

const Financiacion = () => {
  const lola = getEffectiveProduct('lola-cruiser');
  const xxxx = getEffectiveProduct('xxxx-expedition');
  const isHotSale = isHotSaleActive();

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-5xl">
        {isHotSale && (
          <div className="mb-6 bg-primary-orange/10 border-2 border-primary-orange rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-barlow font-black text-xs tracking-[0.2em] text-primary-orange uppercase mb-1">
                🔥 Hot Sale · 3 días
              </p>
              <p className="font-barlow font-black text-xl md:text-2xl text-neutral-black uppercase">
                Bajamos todos los precios hasta el miércoles
              </p>
            </div>
            <Countdown endDate={HOT_SALE.endDate} variant="blocks" theme="light" />
          </div>
        )}

        <SectionTitle
          title={isHotSale ? 'Precios Hot Sale, claros y al frente' : 'Precio claro, sin letra chica'}
          subtitle={
            isHotSale
              ? 'Hasta 6 cuotas SIN interés con tarjeta o ahorrá $200.000 con efectivo / transferencia. Solo por la web.'
              : 'Pagá como te convenga. Así es nuestra financiación.'
          }
        />

        {/* Precio efectivo destacado */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[lola, xxxx].map((p) => (
            <div
              key={p.slug}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start"
            >
              <p className="font-barlow font-black text-2xl text-neutral-black uppercase">
                {p.displayName}
              </p>
              <p className="font-neue text-neutral-darkGreen text-sm mt-1">
                Precio efectivo / transferencia
              </p>
              <p className="font-barlow font-black text-4xl text-primary-orange mt-2">
                {formatPrice(p.pricing.efectivo)}
              </p>
              {isHotSale && p.pricing.precioRegular && (
                <p className="font-neue text-sm text-neutral-gray mt-1">
                  <span className="line-through">{formatPrice(p.pricing.precioRegular)}</span>
                  <span className="ml-2 text-green-700 font-bold">
                    ahorrás {formatPrice(p.pricing.ahorroEfectivo)}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Tabla de cuotas */}
        {isHotSale ? <HotSaleTable lola={lola} xxxx={xxxx} /> : <NormalTable lola={lola} xxxx={xxxx} />}

        {/* Copy legal */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8 mt-10">
          <h3 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
            Medios de pago
          </h3>
          <ul className="space-y-2 font-neue text-neutral-darkGreen">
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">•</span>
              Todos los medios habilitados por Mercado Pago (Visa, Mastercard, American Express, Naranja, Cabal y más).
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">•</span>
              Efectivo y transferencia bancaria con descuento (ver precios arriba).
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">•</span>
              Las cuotas se confirman al pagar en el checkout de Mercado Pago según tu tarjeta y entidad emisora.
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">•</span>
              CFT aplicable en las cuotas con recargo según medio de pago elegido.
            </li>
            {isHotSale && (
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                Promo Hot Sale válida hasta el miércoles 13/05 a las 23:59. Solo en compras web.
              </li>
            )}
          </ul>

          <p className="font-neue font-bold italic text-primary-orange text-base mt-5">
            {isHotSale
              ? '3 días para llevarte la tuya con el mejor precio del año.'
              : 'Sin agencia, sin vueltas, sin "cuotas sin interés" que no son.'}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button to="/test-ride-tucuman" variant="primary" className="rounded-full px-8 py-3.5">
            Agendar test ride
          </Button>
          <Link
            to="/bicicletas-electricas/comparacion-ebike-royriff"
            className="inline-block text-center font-bold py-3.5 px-8 rounded-full bg-transparent text-primary-orange border-2 border-primary-orange hover:bg-primary-orange hover:text-white transition-smooth"
          >
            Comparar LOLA y XXXX
          </Link>
        </div>
      </div>
    </div>
  );
};

const HotSaleTable = ({ lola, xxxx }) => {
  const rows = [
    {
      key: 6,
      label: '6 cuotas SIN interés',
      sublabel: 'destacada · sin recargo',
      lolaCuota: lola.pricing.cuota6,
      lolaTotal: lola.pricing.cuota6Total,
      xxxxCuota: xxxx.pricing.cuota6,
      xxxxTotal: xxxx.pricing.cuota6Total,
      highlight: true,
    },
    {
      key: 3,
      label: '3 cuotas',
      sublabel: 'CFT aplicable',
      lolaCuota: lola.pricing.cuota3,
      lolaTotal: lola.pricing.cuota3Total,
      xxxxCuota: xxxx.pricing.cuota3,
      xxxxTotal: xxxx.pricing.cuota3Total,
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-3 bg-neutral-black text-white font-barlow font-bold text-sm uppercase">
        <div className="px-4 py-3">Plan</div>
        <div className="px-4 py-3 text-right">LOLA</div>
        <div className="px-4 py-3 text-right">XXXX</div>
      </div>
      {rows.map(({ key, label, sublabel, lolaCuota, lolaTotal, xxxxCuota, xxxxTotal, highlight }) => (
        <div
          key={key}
          className={`grid grid-cols-3 border-b border-neutral-gray/25 last:border-b-0 ${
            highlight ? 'bg-primary-orange/5' : ''
          }`}
        >
          <div className="px-4 py-4">
            <p className="font-neue font-bold text-neutral-black">{label}</p>
            <p className="font-neue text-xs text-neutral-gray mt-0.5">{sublabel}</p>
          </div>
          <div className="px-4 py-4 text-right">
            <p className="font-neue font-bold text-neutral-black">{formatPrice(lolaCuota)}/mes</p>
            <p className="font-neue text-xs text-neutral-gray mt-0.5">total {formatPrice(lolaTotal)}</p>
          </div>
          <div className="px-4 py-4 text-right">
            <p className="font-neue font-bold text-neutral-black">{formatPrice(xxxxCuota)}/mes</p>
            <p className="font-neue text-xs text-neutral-gray mt-0.5">total {formatPrice(xxxxTotal)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const NormalTable = ({ lola, xxxx }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="grid grid-cols-3 md:grid-cols-4 bg-neutral-black text-white font-barlow font-bold text-sm uppercase">
      <div className="px-4 py-3">Plan</div>
      <div className="px-4 py-3 hidden md:block">Recargo</div>
      <div className="px-4 py-3 text-right">LOLA</div>
      <div className="px-4 py-3 text-right">XXXX</div>
    </div>
    {NORMAL_INSTALLMENTS.map(({ cuotas, recargo }) => (
      <div key={cuotas} className="grid grid-cols-3 md:grid-cols-4 border-b border-neutral-gray/25 last:border-b-0">
        <div className="px-4 py-4 font-neue font-bold text-neutral-black">{cuotas} cuotas fijas</div>
        <div className="px-4 py-4 hidden md:block font-neue text-neutral-darkGreen">+{recargo}%</div>
        <div className="px-4 py-4 text-right font-neue text-neutral-black">
          {formatPrice(lola.pricing.cuotas[cuotas])}
          <span className="block text-xs text-neutral-gray md:hidden">+{recargo}%</span>
        </div>
        <div className="px-4 py-4 text-right font-neue text-neutral-black">
          {formatPrice(xxxx.pricing.cuotas[cuotas])}
          <span className="block text-xs text-neutral-gray md:hidden">+{recargo}%</span>
        </div>
      </div>
    ))}
  </div>
);

export default Financiacion;
