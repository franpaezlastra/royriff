import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO, COMPANY_INFO } from '../../utils/constants';

const LAST_UPDATED = '24 de abril de 2026';

const TerminosCondiciones = () => {
  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle title="Términos y condiciones" />

        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          <p className="font-neue text-sm text-neutral-gray mb-8">
            Última actualización: {LAST_UPDATED}
          </p>

          <div className="space-y-8 font-neue text-neutral-darkGreen leading-relaxed">
            {/* 1 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                1. Identificación del titular
              </h2>
              <p>
                El sitio web <strong>royriff.com.ar</strong> y la marca {COMPANY_INFO.brandName} son
                operados por <strong>{COMPANY_INFO.razonSocial}</strong>, CUIT {COMPANY_INFO.cuit},
                con domicilio legal en {COMPANY_INFO.domicilioLegal}. Para cualquier consulta
                podés escribirnos a {CONTACT_INFO.email} o al WhatsApp {CONTACT_INFO.whatsapp}.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                2. Alcance
              </h2>
              <p>
                Estos Términos y Condiciones regulan el uso del sitio, la compra de productos de la
                marca {COMPANY_INFO.brandName} y los servicios asociados (envíos, garantía,
                servicio técnico, test rides). Al usar el sitio o realizar una compra, aceptás
                estos términos en su totalidad.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                3. Productos y disponibilidad
              </h2>
              <p>
                Los productos publicados están sujetos a stock disponible. Las imágenes son
                referenciales y pueden presentar variaciones mínimas respecto del producto real.
                Los precios se expresan en <strong>pesos argentinos</strong> e incluyen IVA cuando
                corresponda. Nos reservamos el derecho de modificar precios, especificaciones o
                discontinuar modelos sin aviso previo, sin afectar operaciones ya confirmadas.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                4. Medios de pago y financiación
              </h2>
              <p className="mb-3">
                Aceptamos los siguientes medios:
              </p>
              <ul className="pl-5 list-disc space-y-1">
                <li><strong>Efectivo o transferencia bancaria</strong> con descuento (ver precios
                  vigentes en cada ficha de producto).</li>
                <li><strong>Mercado Pago:</strong> todas las tarjetas de crédito, débito y medios
                  habilitados en la pasarela (Visa, Mastercard, American Express, Naranja, Cabal
                  y otros).</li>
                <li>
                  <strong>Cuotas fijas con recargo</strong> en 3, 6, 9 o 12 pagos. Los recargos
                  vigentes se publican en la página{' '}
                  <Link to="/financiacion" className="text-primary-orange underline">
                    Financiación
                  </Link>
                  . El CFT (Costo Financiero Total) aplicable depende del medio de pago y la
                  entidad emisora, y se muestra en el checkout de Mercado Pago antes de
                  confirmar la operación.
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                5. Envíos
              </h2>
              <p>
                Realizamos envíos a todo el país mediante operadores logísticos habilitados.
                Los plazos y costos se calculan al ingresar el código postal en el checkout.
                El producto se despacha pre-ensamblado al 85-90% con manual y videos tutoriales
                para completar el armado. Detalles completos en{' '}
                <Link to="/envios" className="text-primary-orange underline">
                  /envios
                </Link>
                .
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                6. Garantía y servicio técnico
              </h2>
              <p>
                Ofrecemos <strong>1 (un) año de garantía</strong> sobre componentes eléctricos de
                fábrica (motor, batería, controller, display) contados desde la fecha de entrega.
                La mecánica (cuadro, transmisión, frenos) puede atenderse en cualquier bicicletería
                de tu preferencia. Exclusiones: daños por golpes, agua, mal uso o desgaste
                natural. Detalles completos en{' '}
                <Link to="/servicio-tecnico-y-garantia" className="text-primary-orange underline">
                  /servicio-tecnico-y-garantia
                </Link>
                .
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                7. Derecho de arrepentimiento
              </h2>
              <p>
                Podés ejercer tu derecho de arrepentimiento dentro de los 10 días corridos desde
                la recepción del producto, conforme al Art. 34 de la Ley 24.240 y a la
                Resolución 424/2020. El procedimiento y condiciones están disponibles en{' '}
                <Link to="/boton-de-arrepentimiento" className="text-primary-orange underline">
                  /boton-de-arrepentimiento
                </Link>
                .
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                8. Cambios y devoluciones
              </h2>
              <p>
                Las condiciones para cambios por fallas y devoluciones se publican en{' '}
                <Link to="/cambios-y-devoluciones" className="text-primary-orange underline">
                  /cambios-y-devoluciones
                </Link>
                .
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                9. Propiedad intelectual
              </h2>
              <p>
                Todos los contenidos del sitio (textos, imágenes, logos, videos, diseño) son
                propiedad de {COMPANY_INFO.razonSocial} o de sus respectivos titulares y están
                protegidos por las leyes vigentes. Está prohibida su reproducción o uso comercial
                sin autorización expresa.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                10. Datos personales
              </h2>
              <p>
                Los datos personales que nos brindás son tratados conforme a la{' '}
                <strong>Ley 25.326 de Protección de Datos Personales</strong>. Consultá nuestra{' '}
                <Link to="/politica-de-privacidad" className="text-primary-orange underline">
                  Política de Privacidad
                </Link>{' '}
                para conocer los detalles.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                11. Jurisdicción aplicable
              </h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Para cualquier
                controversia derivada de la compra o uso del sitio, las partes se someten a la
                jurisdicción de los <strong>{COMPANY_INFO.jurisdiccion}</strong>, renunciando a
                cualquier otro fuero que pudiera corresponder.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                12. Modificaciones
              </h2>
              <p>
                {COMPANY_INFO.razonSocial} podrá actualizar estos Términos y Condiciones en
                cualquier momento. La versión vigente es siempre la publicada en el sitio con la
                fecha de última actualización indicada al inicio.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;
