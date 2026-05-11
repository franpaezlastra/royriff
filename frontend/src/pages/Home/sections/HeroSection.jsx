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
  <section className="relative min-h-[80vh] md:min-h-[90vh] overflow-hidden bg-neutral-black">
    {/* Background banner: mobile vertical, desktop horizontal */}
    <picture>
      <source media="(min-width: 768px)" srcSet={hotSaleDesktop} />
      <img
        src={hotSaleMobile}
        alt="Roy Riff Hot Sale"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
      />
    </picture>

    {/* Overlay para que la copy resalte */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/75" />

    {/* Contenido */}
    <div className="container-custom relative z-10 min-h-[80vh] md:min-h-[90vh] flex items-end md:items-center pb-12 md:pb-0 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl text-left"
      >
        {/* Badge Hot Sale */}
        <div className="inline-flex items-center gap-2 bg-primary-orange text-white px-4 py-2 rounded-full mb-5 shadow-lg">
          <span className="font-barlow font-black text-sm tracking-[0.2em] uppercase">
            🔥 {HOT_SALE.label} · {HOT_SALE.badge}
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-barlow font-black !text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] uppercase mb-4 tracking-tight">
          Hasta <span className="text-primary-orange">6 cuotas sin interés</span>
          <br className="hidden md:block" /> y $200.000 off
        </h1>

        {/* Subtítulo */}
        <p className="font-neue !text-white/90 text-base md:text-xl mb-6 leading-relaxed max-w-2xl">
          LOLA desde <strong>$1.800.000</strong> · XXXX desde <strong>$2.500.000</strong>.
          Envío gratis a todo el país. Sólo por la web hasta el miércoles.
        </p>

        {/* Countdown */}
        <div className="mb-7">
          <p className="font-barlow font-bold text-xs tracking-[0.25em] text-white/70 mb-2 uppercase">
            {HOT_SALE.countdownLabel}
          </p>
          <Countdown endDate={HOT_SALE.endDate} variant="blocks" theme="dark" />
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
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
            className="text-base px-7 py-3.5 uppercase font-bold rounded-full !border-white !text-white hover:!bg-white hover:!text-neutral-black"
          >
            Quiero la XXXX
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
