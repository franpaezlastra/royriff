import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
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
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image with dark overlay (mismo patrón que HeroSection home) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundColor: '#151515',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="font-barlow font-black text-4xl md:text-6xl lg:text-7xl !text-white mb-4 leading-tight uppercase">
            Vení a probarla
          </h1>

          <h2 className="font-barlow font-black text-3xl md:text-5xl lg:text-6xl !text-white mb-8 leading-tight uppercase">
            Test drive en Yerba Buena, Tucumán
          </h2>

          <p className="font-neue !text-white text-lg md:text-xl mb-12 font-normal">
            Subite a la LOLA o la XXXX y decidí con toda la info. Sin compromiso, con turno previo.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <Button
              href="#test-drive"
              onClick={scrollToTestDrive}
              variant="primary"
              className="text-base md:text-lg px-8 md:px-12 py-3 md:py-4 uppercase font-bold"
            >
              Agendar turno
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-neue text-white/80 hover:text-white text-sm underline-offset-4 hover:underline transition-colors"
            >
              Coordinamos por WhatsApp en 1 minuto →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocalHero;
