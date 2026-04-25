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
      className="rr-grain relative w-full h-[75vh] min-h-[560px] max-h-[860px] overflow-hidden bg-neutral-black text-white"
    >
      {/* Foto de fondo con tratamiento oscuro */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />
      {/* Capas de overlay — vertical + radial naranja sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.35) 35%, rgba(10,10,10,0.85) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 78% 40%, rgba(255,70,13,0.18), transparent 70%)',
        }}
      />

      {/* Vertical pinned label — lado izquierdo */}
      <div className="hidden md:flex absolute inset-y-0 left-0 w-14 lg:w-16 items-center justify-center border-r border-white/10">
        <span className="rr-vertical-label font-barlow font-black text-[10px] lg:text-xs text-white/70 uppercase">
          Local · Tucumán · Yerba&nbsp;Buena
        </span>
      </div>

      {/* Mobile: eyebrow horizontal */}
      <div className="md:hidden absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <span className="font-barlow font-black text-[10px] text-primary-orange uppercase tracking-[0.3em]">
          Local · Yerba Buena
        </span>
      </div>

      {/* Contenido centrado */}
      <div className="relative h-full flex items-center justify-center px-6 md:pl-20 lg:pl-24 md:pr-6">
        <div className="text-center max-w-4xl">
          {/* Eyebrow desktop */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-primary-orange" />
            <span className="font-barlow font-black text-[11px] lg:text-xs text-primary-orange uppercase tracking-[0.4em]">
              Test drive · sin compromiso
            </span>
            <span className="h-px w-8 bg-primary-orange" />
          </motion.div>

          {/* H1 brutalist */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-barlow font-black uppercase leading-[0.85] tracking-tighter mb-6"
          >
            <span className="block text-5xl sm:text-7xl md:text-[7.5rem] lg:text-[9.5rem] xl:text-[11rem] text-white">
              Vení a
            </span>
            <span className="block text-6xl sm:text-8xl md:text-[8.5rem] lg:text-[10.5rem] xl:text-[12rem] text-primary-orange italic tracking-tight -mt-1 md:-mt-3">
              probarla.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-neue text-white/85 text-base md:text-lg lg:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Test drive gratis en nuestro local de Yerba Buena. Subite a la LOLA
            o la XXXX y decidí con toda la info.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <a
              href="#test-drive"
              onClick={scrollToTestDrive}
              className="group inline-flex items-center gap-3 bg-primary-orange hover:bg-[#E03D0B] text-white font-barlow font-black uppercase tracking-wide text-base md:text-lg py-4 px-9 rounded-full transition-colors shadow-[0_8px_32px_rgba(255,70,13,0.35)]"
            >
              Agendar turno
              <span
                aria-hidden="true"
                className="inline-flex w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 items-center justify-center transition-colors"
              >
                ↓
              </span>
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
      </div>

      {/* Scroll indicator al pie */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-barlow font-black text-[9px] text-white/50 uppercase tracking-[0.3em]">
          Seguí viendo
        </span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div className="rr-scroll-line absolute inset-0 bg-primary-orange" />
        </div>
      </div>
    </section>
  );
};

export default LocalHero;
