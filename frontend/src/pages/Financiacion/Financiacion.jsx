import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import PRODUCT_DATA from '../../utils/productData';
import { formatPrice } from '../../utils/constants';

const INSTALLMENT_OPTIONS = [
  { cuotas: 3, recargo: 11 },
  { cuotas: 6, recargo: 20 },
  { cuotas: 9, recargo: 33 },
  { cuotas: 12, recargo: 44 },
];

const Financiacion = () => {
  const lola = PRODUCT_DATA['lola-cruiser'];
  const xxxx = PRODUCT_DATA['xxxx-expedition'];

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-5xl">
        <SectionTitle
          title="Precio claro, sin letra chica"
          subtitle="Pagá como te convenga. Así es nuestra financiación."
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
            </div>
          ))}
        </div>

        {/* Tabla de cuotas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="grid grid-cols-3 md:grid-cols-4 bg-neutral-black text-white font-barlow font-bold text-sm uppercase">
            <div className="px-4 py-3">Plan</div>
            <div className="px-4 py-3 hidden md:block">Recargo</div>
            <div className="px-4 py-3 text-right">LOLA</div>
            <div className="px-4 py-3 text-right">XXXX</div>
          </div>
          {INSTALLMENT_OPTIONS.map(({ cuotas, recargo }) => (
            <div
              key={cuotas}
              className="grid grid-cols-3 md:grid-cols-4 border-b border-neutral-gray/25 last:border-b-0"
            >
              <div className="px-4 py-4 font-neue font-bold text-neutral-black">
                {cuotas} cuotas fijas
              </div>
              <div className="px-4 py-4 hidden md:block font-neue text-neutral-darkGreen">
                +{recargo}%
              </div>
              <div className="px-4 py-4 text-right font-neue text-neutral-black">
                {formatPrice(lola.pricing.cuotas[cuotas])}
                <span className="block text-xs text-neutral-gray md:hidden">
                  +{recargo}%
                </span>
              </div>
              <div className="px-4 py-4 text-right font-neue text-neutral-black">
                {formatPrice(xxxx.pricing.cuotas[cuotas])}
                <span className="block text-xs text-neutral-gray md:hidden">
                  +{recargo}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Copy legal */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
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
              CFT aplicable según medio de pago elegido.
            </li>
          </ul>

          <p className="font-neue font-bold italic text-primary-orange text-base mt-5">
            Sin agencia, sin vueltas, sin "cuotas sin interés" que no son.
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

export default Financiacion;
