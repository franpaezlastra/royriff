import { Link } from 'react-router-dom';
import { PRODUCTS, formatPrice } from '../../utils/constants';
import { getEffectiveProduct } from '../../utils/productData';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';

const PriceCell = ({ pricing }) => {
  const isHotSale = pricing?.isHotSale === true;
  return (
    <div className="flex flex-col gap-1.5 items-center">
      {isHotSale && (
        <span className="font-barlow font-black text-[10px] tracking-[0.2em] uppercase text-white bg-primary-orange rounded-full px-2.5 py-0.5">
          🔥 Hot Sale
        </span>
      )}
      <p className="font-barlow font-black text-primary-orange text-lg md:text-xl uppercase leading-tight tracking-tight">
        6 cuotas SIN interés de {formatPrice(pricing.cuota6)}
      </p>
      <p className="font-neue text-sm text-neutral-black">
        o {formatPrice(pricing.efectivo)} en efectivo
        {pricing.ahorroEfectivo || pricing.ahorro ? (
          <>
            {' · '}
            <span className="font-bold text-primary-orange">
              ahorrás {formatPrice(pricing.ahorroEfectivo || pricing.ahorro)}
            </span>
          </>
        ) : null}
      </p>
      {isHotSale && pricing.precioRegular ? (
        <p className="font-neue text-xs text-neutral-gray">
          antes <span className="line-through">{formatPrice(pricing.precioRegular)}</span>
        </p>
      ) : null}
      <p className="font-neue text-[11px] text-neutral-gray leading-snug max-w-[260px]">
        {isHotSale
          ? 'Precio Hot Sale hasta el miércoles 13/05. También 3 cuotas con tarjeta · CFT aplicable.'
          : 'Más planes en 3, 9 o 12 cuotas. CFT según medio de pago.'}
      </p>
    </div>
  );
};

const Comparador = () => {
  const lolaPricing = getEffectiveProduct('lola-cruiser').pricing;
  const xxxxPricing = getEffectiveProduct('xxxx-expedition').pricing;

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        <SectionTitle
          title="Elegí tu Roy Riff: compará LOLA vs XXXX"
          subtitle="Dos estilos. Dos rendimientos. Elegí según tu distancia, terreno y comodidad."
        />

        {/* Tabla Comparativa */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full rr-comparador-table">
              {/*
                !bg / !text: evita que estilos del host (p. ej. WordPress) dejen el thead
                con fondo crema y texto invisible (mismo color que el fondo).
              */}
              <thead className="!bg-[#151515] !text-white [&_th]:!text-white [&_*]:!text-white">
                <tr>
                  <th className="rr-comparador-headcell px-6 py-4 text-left font-barlow !text-white">Característica</th>
                  <th className="rr-comparador-headcell px-6 py-4 text-center !text-white">
                    <div className="font-barlow font-black text-2xl !text-white">LOLA</div>
                    <div className="text-sm font-normal !text-white/90">Urban Cruiser</div>
                  </th>
                  <th className="rr-comparador-headcell px-6 py-4 text-center !text-white">
                    <div className="font-barlow font-black text-2xl !text-white">XXXX</div>
                    <div className="text-sm font-normal !text-white/90">Expedición</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Uso ideal</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.useCase}</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.useCase}</td>
                </tr>
                <tr className="bg-primary-beige border-b">
                  <td className="px-6 py-4 font-bold align-top">Precio</td>
                  <td className="px-6 py-4 text-center">
                    <PriceCell pricing={lolaPricing} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PriceCell pricing={xxxxPricing} />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Autonomía</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.specs.autonomy}</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.specs.autonomy}</td>
                </tr>
                <tr className="bg-primary-beige border-b">
                  <td className="px-6 py-4 font-bold">Batería</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.specs.battery}</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.specs.battery}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Rodado</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.specs.tires}</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.specs.tires}</td>
                </tr>
                <tr className="bg-primary-beige border-b">
                  <td className="px-6 py-4 font-bold">Suspensión</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.specs.suspension}</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.specs.suspension}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-bold">Peso</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.LOLA.specs.weight} kg</td>
                  <td className="px-6 py-4 text-center">{PRODUCTS.XXXX.specs.weight} kg</td>
                </tr>
                <tr className="bg-primary-beige">
                  <td className="px-6 py-4 font-bold">Acción</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/bicicletas-electricas/${PRODUCTS.LOLA.slug}`}
                      className="inline-block bg-primary-orange text-white px-6 py-2 rounded-md font-bold hover:bg-[#E03D0B] transition-smooth"
                    >
                      Ver LOLA
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/bicicletas-electricas/${PRODUCTS.XXXX.slug}`}
                      className="inline-block bg-primary-orange text-white px-6 py-2 rounded-md font-bold hover:bg-[#E03D0B] transition-smooth"
                    >
                      Ver XXXX
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md border-2 border-primary-orange/20">
            <h3 className="font-barlow font-bold text-2xl mb-4">LOLA es para vos si...</h3>
            <ul className="space-y-3 text-neutral-darkGreen">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Te movés principalmente en ciudad / ciclovías / asfalto</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Te importa que sea más liviana (32 kg)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Querés paso bajo para subir/bajar cómodo</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Recorridos diarios de hasta 50-60 km</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border-2 border-primary-orange/20">
            <h3 className="font-barlow font-bold text-2xl mb-4">XXXX es para vos si...</h3>
            <ul className="space-y-3 text-neutral-darkGreen">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Hacés distancias largas (70+ km)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Terrain mixto / tierra / arena / caminos irregulares</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Priorizás estabilidad y robustez</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Querés la máxima autonomía posible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <p className="text-neutral-darkGreen mb-6">
            ¿Todavía no estás seguro? Hablemos y te ayudamos a elegir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="https://wa.me/5493812006514" variant="primary">
              Consultar por WhatsApp
            </Button>
            <Button to="/test-ride-tucuman" variant="secondary">
              Agendar test ride
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparador;
