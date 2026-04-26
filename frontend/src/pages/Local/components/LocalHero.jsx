import { motion } from 'framer-motion';
import { CONTACT_INFO } from '../../../utils/constants';

// Fondo del hero: foto producción Noviembre 2026 — RoyRiff-114
import heroBg from '../../../assets/local/hero.webp';

const scrollToTestDrive = (e) => {
  e.preventDefault();
  const target = document.getElementById('test-drive');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const LocalHero = () => {
  const whatsappUrl = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
    'Hola! Quiero coordinar un test drive en el local de Yerba Buena.'
  )}`;

  return (
    <section
      aria-label="Local Roy Riff en Yerba Buena"
      className="relative w-full h-[70vh] min-h-[460px] max-h-[720px] overflow-hidden bg-neutral-black"
    >
      {/* Foto de fondo */}
      <img
        src={heroBg}
        alt="Local Roy Riff en Yerba Buena, Tucumán"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* Gradient overlay (mismo patrón que /galeria) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70" />

      {/* Contenido bottom-aligned, mismo patrón que Galería */}
      <div className="relative container-custom h-full flex flex-col justify-end pb-12 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-barlow font-bold text-primary-orange text-xs md:text-sm uppercase tracking-[0.25em] mb-3"
        >
          Local · Yerba Buena · Tucumán
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow font-black text-white text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tighter mb-4"
        >
          Vení a <span className="text-primary-orange">probarla.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-neue text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-7"
        >
          Test drive gratis en nuestro local de Yerba Buena. Subite a la LOLA
          o la XXXX y decidí con toda la info.
        </motion.p>

        {/* CTA primary + micro-copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-start gap-3"
        >
          <a
            href="#test-drive"
            onClick={scrollToTestDrive}
            className="inline-flex items-center gap-2 bg-primary-orange hover:bg-[#E03D0B] text-white font-barlow font-black uppercase tracking-wide text-sm md:text-base py-3.5 px-8 rounded-full transition-colors shadow-[0_8px_28px_rgba(255,70,13,0.35)]"
          >
            Agendar turno
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-neue text-white/70 hover:text-white text-xs md:text-sm underline-offset-4 hover:underline transition-colors"
          >
            Coordinamos el horario por WhatsApp en 1 minuto →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LocalHero;
