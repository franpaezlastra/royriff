import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://api.royriff.com.ar/wp-content/uploads/2026/02/IMG_8240.JPG-scaled.webp)',
          backgroundColor: '#151515' // Fallback mientras no carga la imagen
        }}
      >
        {/* Dark Overlay para que el texto blanco resalte */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Title */}
          <h1 className="font-barlow font-black text-4xl md:text-6xl lg:text-7xl !text-white mb-4 leading-tight uppercase">
            Bicicletas eléctricas urbanas
          </h1>
          
          <h2 className="font-barlow font-black text-3xl md:text-5xl lg:text-6xl !text-white mb-8 leading-tight uppercase">
            Gran autonomía y diseño
          </h2>

          {/* Subtitle - PP Neue Montreal para textos largos */}
          <p className="font-neue !text-white text-lg md:text-xl mb-12 font-normal">
            Tu camino, tus reglas. Envíos y financiación a todo el país.
          </p>

          {/* CTA Button */}
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
};

export default HeroSection;
