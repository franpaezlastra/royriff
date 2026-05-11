import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import Countdown from '../../../components/common/Countdown';
import { HOT_SALE, isHotSaleActive } from '../../../utils/promoConfig';
import hotSaleDesktop from '../../../assets/promo/hot-sale-desktop.webp';
import hotSaleMobile from '../../../assets/promo/hot-sale-mobile.webp';

const HeroSection = () => {
  if (isHotSaleActive()) {
    return <HotSaleHero />;
  }
  return <NormalHero />;
};

const NormalHero = () => (
  <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://api.royriff.com.ar/wp-content/uploads/2026/02/IMG_8240.JPG-scaled.webp)',
        backgroundColor: '#151515',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
    <div className="container-custom relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="font-barlow font-black text-4xl md:text-6xl lg:text-7xl !text-white mb-4 leading-tight uppercase">
          Bicicletas eléctricas urbanas
        </h1>
        <h2 className="font-barlow font-black text-3xl md:text-5xl lg:text-6xl !text-white mb-8 leading-tight uppercase">
          Gran autonomía y diseño
        </h2>
        <p className="font-neue !text-white text-lg md:text-xl mb-12 font-normal">
          Tu camino, tus reglas. Envíos y financiación a todo el país.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            to="/bicicletas-electricas/comparacion-ebike-royriff"
            variant="primary"
            className="text-base md:text-lg px-8 md:px-12 py-3 md:py-4 uppercase font-bold"
          >
            Comparar LOLA vs XXXX
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const HotSaleHero = () => (
  <>
    {/* ════════ SECCIÓN 1: BANNER LIMPIO (sin texto overlay) ════════ */}
    <section className="bg-neutral-black w-full overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={hotSaleDesktop} />
        <img
          src={hotSaleMobile}
          alt="Roy Riff Hot Sale · 11 al 13 de mayo · hasta 6 cuotas sin interés y $200.000 off"
          className="w-full h-auto object-cover max-h-[80vh] mx-auto block"
          loading="eager"
          fetchpriority="high"
        />
      </picture>
    </section>

    {/* ════════ SECCIÓN 2: COPY + COUNTDOWN + CTAs sobre fondo blanco ════════ */}
    <section className="bg-white py-12 md:py-16 border-b border-neutral-gray/15">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* Columna 1: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-orange text-white px-3 py-1.5 rounded-full mb-4 shadow-sm">
              <span className="font-barlow font-black text-xs tracking-[0.2em] uppercase">
                🔥 {HOT_SALE.label} · {HOT_SALE.badge}
              </span>
            </div>
            <h1 className="font-barlow font-black text-neutral-black text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.05] uppercase mb-4 tracking-tight">
              Hasta <span className="text-primary-orange">6 cuotas sin interés</span> y $200.000 off
            </h1>
            <p className="font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              LOLA desde <strong className="text-neutral-black">$1.800.000</strong> · XXXX desde{' '}
              <strong className="text-neutral-black">$2.500.000</strong>. Envío gratis a todo el país.
              Sólo por la web hasta el miércoles 13/05.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                to="/bicicletas-electricas/lola-cruiser"
                variant="primary"
                className="text-base px-7 py-3.5 uppercase font-bold rounded-full"
              >
                Quiero la LOLA
              </Button>
              <Button
                to="/bicicletas-electricas/xxxx-expedition"
                variant="secondary"
                className="text-base px-7 py-3.5 uppercase font-bold rounded-full"
              >
                Quiero la XXXX
              </Button>
            </div>
          </div>

          {/* Columna 2: Countdown */}
          <div className="md:justify-self-end w-full md:w-auto">
            <div className="bg-primary-beige border border-primary-orange/25 rounded-2xl p-6 md:p-7 shadow-sm">
              <p className="font-barlow font-bold text-[11px] tracking-[0.25em] text-primary-orange mb-3 uppercase text-center md:text-left">
                {HOT_SALE.countdownLabel} · 11 al 13 de mayo
              </p>
              <Countdown
                endDate={HOT_SALE.endDate}
                variant="blocks"
                theme="light"
                className="justify-center md:justify-start"
              />
              <p className="font-neue text-xs text-neutral-darkGreen/70 mt-3 text-center md:text-left">
                Envío gratis a todo el país · Promo solo por la web
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default HeroSection;
