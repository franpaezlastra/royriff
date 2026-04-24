import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { CONTACT_INFO } from '../../utils/constants';

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
        'Visitá nuestro local en Yerba Buena, Tucumán. Probá la LOLA y la XXXX sin compromiso. Equipo propio, service in-house y parking. Coordinamos test drive por WhatsApp.'
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
      <section
        aria-labelledby="local-closing-heading"
        className="rr-grain relative bg-neutral-black text-white py-20 md:py-28 overflow-hidden"
      >
        {/* Glow orange diagonal */}
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,70,13,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative container-custom text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-primary-orange" />
              <span className="font-barlow font-black text-[11px] text-primary-orange uppercase tracking-[0.4em]">
                Te esperamos
              </span>
              <span className="h-px w-10 bg-primary-orange" />
            </div>
            <h2
              id="local-closing-heading"
              className="font-barlow font-black text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.88] tracking-tighter mb-6"
            >
              Yerba Buena,{' '}
              <span className="italic text-primary-orange">te espera.</span>
            </h2>
            <p className="font-neue text-white/75 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Pasá, probalas, conocenos. Sin vueltas, sin presión, con toda la
              info que necesitás para decidir tranquilo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/test-ride-tucuman"
                className="inline-flex items-center justify-center gap-2 bg-primary-orange hover:bg-[#E03D0B] text-white font-barlow font-black uppercase tracking-wide text-sm py-3.5 px-7 rounded-full transition-colors shadow-[0_8px_28px_rgba(255,70,13,0.35)]"
              >
                Agendar test drive
              </Link>
              <a
                href={whatsappFinal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-white text-white font-barlow font-black uppercase tracking-wide text-sm py-3 px-7 rounded-full transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={CONTACT_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-white text-white font-barlow font-black uppercase tracking-wide text-sm py-3 px-7 rounded-full transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Local;
