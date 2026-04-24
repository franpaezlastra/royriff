import { FaWhatsapp } from 'react-icons/fa';
import SectionTitle from './SectionTitle';
import { CONTACT_INFO } from '../../utils/constants';

const TutorialPlaceholder = ({ title, topic }) => {
  const mensaje = topic
    ? `Hola! Tengo una consulta sobre ${topic} de mi Roy Riff.`
    : 'Hola! Tengo una consulta sobre mi Roy Riff.';
  const whatsappUrl = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-3xl">
        <SectionTitle title={title} />

        <div className="bg-white p-8 md:p-10 rounded-lg shadow-md text-center">
          <p className="font-neue text-lg text-neutral-black leading-relaxed mb-4">
            Estamos preparando nuestros tutoriales para vos.
          </p>
          <p className="font-neue text-base text-neutral-darkGreen leading-relaxed mb-3">
            Cuanto antes estén listos, te los compartiremos.
          </p>
          <p className="font-neue text-base text-neutral-darkGreen leading-relaxed mb-8">
            Siempre podés hablar con nuestro equipo y te resolvemos cualquier tipo de duda.
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
      </div>
    </div>
  );
};

export default TutorialPlaceholder;
