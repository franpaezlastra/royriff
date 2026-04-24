import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';
import hectorImg from '../../../assets/testimonios/hector-gramajo.webp';
import agustinImg from '../../../assets/testimonios/agustin-fernandez.webp';
import arielImg from '../../../assets/testimonios/ariel-martinez.webp';
import federicoImg from '../../../assets/testimonios/federico-jairala.webp';
import matiasImg from '../../../assets/testimonios/matias-salazar.webp';
import patriciaImg from '../../../assets/testimonios/patricia-cigale.webp';

const testimonials = [
  {
    name: 'Héctor Gramajo',
    location: 'Tucumán',
    model: 'LOLA (x2)',
    rating: 5,
    text: 'Nos llevamos dos LOLAs con mi mujer, una de cada color. Salimos a pasear juntos, disfrutamos cada paseo y encima cero combustible.',
    image: hectorImg,
  },
  {
    name: 'Agustín Fernández',
    location: 'Tucumán',
    model: 'XXXX',
    rating: 5,
    text: 'Uso la XXXX para trayectos medianos todos los días. Cómoda, potente y la batería responde bien en el uso real.',
    image: agustinImg,
  },
  {
    name: 'Ariel Martínez',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'Compré la LOLA para hacer ejercicio y salir a rodar. Me re enganché, ahora salgo varias veces por semana.',
    image: arielImg,
  },
  {
    name: 'Federico Jairala',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'Una bici muy bien armada, con buena terminación. Roy Riff me atendió de primera y quedé encantado con el servicio.',
    image: federicoImg,
  },
  {
    name: 'Matías Salazar',
    location: 'Tucumán',
    model: 'XXXX',
    rating: 5,
    text: 'La XXXX me cambió el día a día. Trayectos que antes hacía en auto ahora los hago pedaleando y llego con energía.',
    image: matiasImg,
  },
  {
    name: 'Patricia Cigale',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'La LOLA es elegante y súper cómoda. Me encanta la sensación de salir a andar sin preocuparme por el tráfico.',
    image: patriciaImg,
  },
];

const AUTO_ROTATE_MS = 6000;
const PAGE_SIZE = 3;

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-2 border-neutral-gray/20 hover:border-primary-orange transition-all duration-300 h-full flex flex-col">
    <div className="flex gap-1 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <FiStar key={i} className="w-5 h-5 fill-primary-yellow text-primary-yellow" />
      ))}
    </div>

    <p className="text-neutral-darkGreen mb-6 italic flex-grow">
      "{testimonial.text}"
    </p>

    <div className="flex items-center gap-4">
      {testimonial.image ? (
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-orange to-primary-yellow flex items-center justify-center text-white font-bold text-xl">
          {testimonial.name.charAt(0)}
        </div>
      )}
      <div>
        <div className="font-bold text-neutral-black">{testimonial.name}</div>
        <div className="text-sm text-neutral-darkGreen">
          {testimonial.location} • {testimonial.model}
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const pageCount = Math.ceil(testimonials.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pageCount), AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [pageCount, isPaused]);

  const currentGroup = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const goTo = (idx) => setPage(((idx % pageCount) + pageCount) % pageCount);

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-b from-primary-beige to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom">
        <SectionTitle
          title="Lo que dicen los RoyRiffers"
          subtitle="Historias reales de quienes ya disfrutan su libertad sobre dos ruedas."
        />

        <div className="relative">
          {/* Botones prev/next (solo desktop) */}
          {pageCount > 1 && (
            <>
              <button
                type="button"
                aria-label="Testimonios anteriores"
                onClick={() => goTo(page - 1)}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-primary-orange hover:text-white text-neutral-black transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Testimonios siguientes"
                onClick={() => goTo(page + 1)}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:bg-primary-orange hover:text-white text-neutral-black transition-colors"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Grid animado */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {currentGroup.map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Ir a grupo ${idx + 1} de testimonios`}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === page
                    ? 'w-8 bg-primary-orange'
                    : 'w-2 bg-neutral-gray/60 hover:bg-neutral-gray'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
