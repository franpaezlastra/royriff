import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from './SectionTitle';
import { CONTACT_INFO } from '../../utils/constants';

/**
 * Layout reusable para páginas de tutoriales con contenido real.
 *
 * Props:
 * - title: H1 de la página
 * - subtitle: subtítulo opcional debajo del título
 * - intro: párrafo introductorio (string o JSX)
 * - topic: tema para pre-cargar el mensaje de WhatsApp del CTA final
 * - children: secciones del tutorial (cada una un <section> con h2 + contenido)
 */
const TutorialLayout = ({ title, subtitle, intro, topic, children }) => {
  const mensaje = topic
    ? `Hola! Tengo una consulta sobre ${topic} de mi Roy Riff.`
    : 'Hola! Tengo una consulta sobre mi Roy Riff.';
  const whatsappUrl = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle title={title} subtitle={subtitle} />

        <article className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          {intro && (
            <p className="font-neue text-base md:text-lg text-neutral-black leading-relaxed mb-8">
              {intro}
            </p>
          )}

          <div className="space-y-8 font-neue text-neutral-darkGreen leading-relaxed">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-gray/25 text-center">
            <p className="font-neue text-sm text-neutral-darkGreen mb-4">
              ¿Te quedaron dudas? Escribinos por WhatsApp y te ayudamos en el momento.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-orange text-white font-bold py-3 px-6 rounded-full hover:bg-[#E03D0B] transition-smooth"
            >
              <FaWhatsapp className="w-5 h-5" />
              Hablar con el equipo
            </a>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TutorialLayout;
