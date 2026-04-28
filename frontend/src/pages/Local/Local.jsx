import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { CONTACT_INFO } from '../../utils/constants';
import SectionTitle from '../../components/common/SectionTitle';

import LocalHero from './components/LocalHero';
import LocalGalleryMasonry from './components/LocalGalleryMasonry';
import LocalTeamSection from './components/LocalTeamSection';
import LocalBridgeBanner from './components/LocalBridgeBanner';
import LocalTestDriveSection from './components/LocalTestDriveSection';
import LocalInfoSection from './components/LocalInfoSection';
import LocalFAQ from './components/LocalFAQ';

const Local = () => {
  useEffect(() => {
    document.title = 'Local Roy Riff en Tucumán · Probá tu bici eléctrica';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Visitá nuestro local en Yerba Buena, Tucumán. Probá la LOLA y la XXXX sin compromiso. Equipo propio, service in-house y parking. Coordinamos test ride por WhatsApp.'
      );
    }
  }, []);

  const whatsappFinal = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
    'Hola! Quiero coordinar una visita al local de Roy Riff.'
  )}`;

  return (
    <div className="bg-primary-beige">
      <LocalHero />
      <LocalGalleryMasonry />
      <LocalTeamSection />
      <LocalBridgeBanner />
      <LocalTestDriveSection />
      <LocalInfoSection />
      <LocalFAQ />

      {/* CTA final — closing statement */}
      <section className="bg-primary-beige py-16 md:py-20">
        <div className="container-custom text-center max-w-3xl">
          <SectionTitle
            title="Te esperamos"
            subtitle="Pasá, probalas, conocenos. Sin vueltas, sin presión, con toda la info que necesitás para decidir tranquilo."
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/test-ride-tucuman"
              className="inline-flex items-center justify-center gap-2 bg-primary-orange hover:bg-[#E03D0B] text-white font-bold uppercase tracking-wide text-sm py-3.5 px-7 rounded-full transition-colors"
            >
              Agendar test ride
            </Link>
            <a
              href={whatsappFinal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-neutral-black/25 hover:border-neutral-black text-neutral-black font-bold uppercase tracking-wide text-sm py-3 px-7 rounded-full transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href={CONTACT_INFO.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-neutral-black/25 hover:border-neutral-black text-neutral-black font-bold uppercase tracking-wide text-sm py-3 px-7 rounded-full transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
              Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Local;
