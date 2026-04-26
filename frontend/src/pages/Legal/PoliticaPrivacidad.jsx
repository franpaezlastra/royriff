import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO, COMPANY_INFO } from '../../utils/constants';

const LAST_UPDATED = '26 de abril de 2026';

const PoliticaPrivacidad = () => {
  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle title="Política de privacidad" />

        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          <p className="font-neue text-sm text-neutral-gray mb-8">
            Última actualización: {LAST_UPDATED}
          </p>

          <div className="space-y-8 font-neue text-neutral-darkGreen leading-relaxed">
            {/* 1 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                1. Responsable del tratamiento
              </h2>
              <p>
                El sitio web <strong>royriff.com.ar</strong> y la marca {COMPANY_INFO.brandName} son
                operados por <strong>{COMPANY_INFO.razonSocial}</strong>, CUIT {COMPANY_INFO.cuit},
                con domicilio legal en {COMPANY_INFO.domicilioLegal}. Esta política explica qué
                datos personales recolectamos, con qué finalidad, cómo los usamos y qué derechos
                tenés sobre ellos. Para consultas o ejercicio de derechos podés escribirnos a{' '}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-primary-orange underline"
                >
                  {CONTACT_INFO.email}
                </a>{' '}
                o al WhatsApp {CONTACT_INFO.whatsapp}.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                2. Marco legal
              </h2>
              <p>
                Tratamos tus datos conforme a la <strong>Ley 25.326</strong> de Protección de
                Datos Personales de la República Argentina, su decreto reglamentario 1558/2001 y
                las disposiciones de la Agencia de Acceso a la Información Pública (AAIP). Para
                operaciones de comercio electrónico se aplica además la Ley 24.240 de Defensa del
                Consumidor y la Resolución 424/2020.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                3. Datos que recolectamos
              </h2>
              <p className="mb-3">Recolectamos únicamente los datos necesarios para operar:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Datos de contacto:</strong> nombre, apellido, email, teléfono / WhatsApp,
                  cuando completás formularios (test ride, contacto, compra) o nos escribís.
                </li>
                <li>
                  <strong>Datos de envío y facturación:</strong> domicilio, código postal,
                  localidad, provincia, DNI / CUIT cuando hacés una compra.
                </li>
                <li>
                  <strong>Datos de pago:</strong> los datos de tarjeta o medio de pago se procesan
                  directamente en Mercado Pago. <strong>Roy Riff no almacena ni accede a datos
                  de tarjetas.</strong>
                </li>
                <li>
                  <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, sistema
                  operativo, páginas visitadas, tiempo de permanencia y referidor, recolectados
                  mediante cookies y herramientas analíticas.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                4. Finalidad del tratamiento
              </h2>
              <p className="mb-3">Usamos tus datos para:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Procesar y entregar tus compras (incluido el envío y la facturación).</li>
                <li>Gestionar consultas, turnos de test ride y comunicaciones de postventa.</li>
                <li>Brindar garantía y servicio técnico sobre los productos adquiridos.</li>
                <li>Cumplir con obligaciones legales, fiscales y contables.</li>
                <li>
                  Mejorar la experiencia del sitio y nuestras comunicaciones (siempre de forma
                  agregada y anónima cuando es posible).
                </li>
                <li>
                  Enviarte novedades, promociones o newsletter <strong>solo si nos diste tu
                  consentimiento explícito</strong> y siempre con opción de baja.
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                5. Base legal del tratamiento
              </h2>
              <p>
                El tratamiento se basa en: (a) tu <strong>consentimiento</strong> al completar
                formularios o aceptar cookies, (b) la <strong>ejecución de un contrato</strong>{' '}
                cuando hacés una compra, (c) el <strong>cumplimiento de obligaciones legales</strong>{' '}
                (fiscales, contables, defensa del consumidor) y (d) el <strong>interés legítimo</strong>{' '}
                de Roy Riff para mejorar el servicio y prevenir fraude.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                6. Compartición con terceros
              </h2>
              <p className="mb-3">
                No vendemos ni cedemos tus datos. Solo los compartimos con proveedores que
                necesitamos para operar:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Mercado Pago</strong> — procesamiento de pagos (consultá su política en{' '}
                  <a
                    href="https://www.mercadopago.com.ar/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-orange underline"
                  >
                    mercadopago.com.ar/privacidad
                  </a>
                  ).
                </li>
                <li>
                  <strong>Operadores logísticos</strong> (Andreana, OCA y similares) — para
                  coordinar y entregar envíos.
                </li>
                <li>
                  <strong>SiteGround</strong> — hosting del sitio.
                </li>
                <li>
                  <strong>Google y Meta</strong> — métricas anónimas de tráfico y, si aceptás,
                  cookies publicitarias.
                </li>
                <li>
                  <strong>Autoridades públicas</strong> — únicamente cuando un requerimiento legal
                  o judicial nos obligue.
                </li>
              </ul>
            </section>

            {/* 7 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                7. Cookies
              </h2>
              <p>
                Usamos cookies propias y de terceros para mantener la sesión, recordar el carrito
                de compras, medir tráfico y mejorar el sitio. Podés bloquear o eliminar cookies
                desde la configuración de tu navegador, aunque algunas funciones (carrito,
                checkout) pueden dejar de funcionar correctamente.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                8. Conservación de los datos
              </h2>
              <p>
                Conservamos tus datos por el tiempo necesario para cumplir las finalidades
                indicadas y los plazos legales aplicables (obligaciones fiscales, garantía, defensa
                del consumidor). Una vez vencidos esos plazos, los datos se eliminan o anonimizan.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                9. Derechos del titular (Ley 25.326)
              </h2>
              <p className="mb-3">Tenés derecho a:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Acceder</strong> a los datos personales que tengamos sobre vos.
                </li>
                <li>
                  <strong>Rectificar</strong> datos inexactos o desactualizados.
                </li>
                <li>
                  <strong>Solicitar la supresión</strong> cuando ya no sean necesarios o retires
                  tu consentimiento.
                </li>
                <li>
                  <strong>Oponerte</strong> al uso para fines de marketing o newsletter.
                </li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos escribinos a{' '}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-primary-orange underline"
                >
                  {CONTACT_INFO.email}
                </a>
                . Respondemos en un plazo máximo de 10 días corridos. Si considerás que no
                respetamos tus derechos, podés presentar una denuncia ante la{' '}
                <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                10. Seguridad
              </h2>
              <p>
                Aplicamos medidas técnicas y organizativas razonables para proteger tus datos:
                conexión cifrada (HTTPS), control de accesos, copias de respaldo y proveedores
                que cumplen estándares de seguridad. Ningún sistema es 100 % invulnerable, pero
                trabajamos para minimizar los riesgos.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                11. Menores de edad
              </h2>
              <p>
                El sitio está dirigido a personas mayores de 18 años. No recolectamos datos
                personales de menores de forma intencional. Si detectamos que un menor envió
                datos sin autorización de su responsable, los eliminamos.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
                12. Cambios en esta política
              </h2>
              <p>
                Podemos actualizar esta política para reflejar cambios legales u operativos. La
                versión vigente siempre estará disponible en esta página con su fecha de última
                actualización. Te recomendamos revisarla periódicamente.
              </p>
            </section>

            {/* Footer link */}
            <div className="pt-6 border-t border-neutral-gray/30">
              <p className="text-sm text-neutral-gray">
                Ver también:{' '}
                <Link to="/terminos-y-condiciones" className="text-primary-orange underline">
                  Términos y condiciones
                </Link>{' '}
                ·{' '}
                <Link to="/cambios-y-devoluciones" className="text-primary-orange underline">
                  Cambios y devoluciones
                </Link>{' '}
                ·{' '}
                <Link to="/boton-de-arrepentimiento" className="text-primary-orange underline">
                  Botón de arrepentimiento
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;
