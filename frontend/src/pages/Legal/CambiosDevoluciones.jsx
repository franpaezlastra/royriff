import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO, COMPANY_INFO } from '../../utils/constants';

const CambiosDevoluciones = () => {
  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle
          title="Cambios y devoluciones"
          subtitle="Todo lo que necesitás saber sobre cambios por falla, arrepentimiento y garantía."
        />

        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md space-y-8 font-neue text-neutral-darkGreen leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              1. Derecho de arrepentimiento (10 días)
            </h2>
            <p className="mb-3">
              Conforme al <strong>Art. 34 de la Ley 24.240</strong> y la{' '}
              <strong>Resolución 424/2020</strong>, si sos consumidor final tenés derecho a
              arrepentirte de la compra dentro de los <strong>10 (diez) días corridos desde la
              recepción</strong> del producto, sin necesidad de expresar motivo y sin costo
              adicional para vos.
            </p>
            <p>
              Iniciá la solicitud desde{' '}
              <Link to="/boton-de-arrepentimiento" className="text-primary-orange underline">
                Botón de arrepentimiento
              </Link>{' '}
              o escribinos por WhatsApp.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              2. Cambios por falla de fábrica (garantía)
            </h2>
            <p className="mb-3">
              Tu Roy Riff cuenta con <strong>1 (un) año de garantía</strong> sobre componentes
              eléctricos (motor, batería, controller, display), contados desde la fecha de
              entrega. Por fallas de fábrica detectadas dentro de ese plazo, coordinamos la
              reparación o reemplazo del componente defectuoso sin costo para el consumidor.
            </p>
            <p>
              Para vicios ocultos que se manifiesten después, aplican los plazos previstos por el
              <strong> Art. 11 y siguientes de la Ley 24.240</strong>.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              3. Condiciones para devolución por arrepentimiento
            </h2>
            <ul className="pl-5 list-disc space-y-2">
              <li>
                El producto debe estar en las <strong>mismas condiciones en que se entregó</strong>,
                con embalaje original, manuales, accesorios incluidos y sin uso significativo.
              </li>
              <li>
                No se aceptan devoluciones de productos con rayones, golpes, modificaciones o
                señales de uso intensivo (no imputables a transporte o fábrica).
              </li>
              <li>
                El reintegro se realiza por el <strong>mismo medio de pago</strong> utilizado para
                la compra, dentro de los plazos previstos por la normativa vigente.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              4. ¿Quién paga el envío de devolución?
            </h2>
            <p>
              Conforme a la Ley 24.240, el costo del envío de devolución por arrepentimiento{' '}
              <strong>no es a cargo del consumidor</strong>. Coordinamos el retiro desde tu
              domicilio o el punto de entrega más conveniente sin costo adicional para vos.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              5. Proceso paso a paso
            </h2>
            <ol className="pl-5 list-decimal space-y-2">
              <li>Iniciás la solicitud vía{' '}
                <Link to="/boton-de-arrepentimiento" className="text-primary-orange underline">
                  Botón de arrepentimiento
                </Link>{' '}
                o WhatsApp al {CONTACT_INFO.whatsapp}.
              </li>
              <li>Nuestro equipo te confirma la recepción y coordina el retiro (plazo
                estimado: 24-72 hs hábiles desde la solicitud).</li>
              <li>Se retira el producto en el domicilio y condiciones acordadas.</li>
              <li>Una vez revisado en nuestro centro técnico, procesamos el reintegro por el
                mismo medio de pago utilizado.</li>
              <li>Te enviamos el comprobante del reintegro por email.</li>
            </ol>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              6. Casos no cubiertos por garantía
            </h2>
            <p className="mb-3">
              La garantía no cubre daños causados por:
            </p>
            <ul className="pl-5 list-disc space-y-1">
              <li>Golpes, caídas, choques o siniestros de cualquier tipo.</li>
              <li>Uso indebido o intensivo fuera de las especificaciones del producto
                (ej: sobrecarga, competencia deportiva).</li>
              <li>Contacto prolongado con agua o inmersión en líquidos.</li>
              <li>Desgaste natural por uso (frenos, cubiertas, cadena, etc.).</li>
              <li>Reparaciones o modificaciones realizadas por terceros no autorizados.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-barlow font-black text-xl text-neutral-black mb-3 uppercase">
              7. Contacto
            </h2>
            <p className="mb-4">
              Si tenés cualquier duda, escribinos antes de iniciar el proceso. Nuestro equipo te
              va a guiar en cada paso.
            </p>
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-orange text-white font-bold py-3 px-6 rounded-full hover:bg-[#E03D0B] transition-smooth"
            >
              <FaWhatsapp className="w-5 h-5" />
              Hablar con el equipo
            </a>
          </section>

          <div className="pt-6 border-t border-neutral-gray/30 text-xs text-neutral-gray">
            Política publicada por <strong>{COMPANY_INFO.razonSocial}</strong> (CUIT{' '}
            {COMPANY_INFO.cuit}), domicilio: {COMPANY_INFO.domicilioLegal}.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambiosDevoluciones;
