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
    model: 'LOLA ×2',
    rating: 5,
    text: 'Nos llevamos dos LOLAs con mi mujer, una de cada color. Cada paseo juntos, cero combustible.',
    image: hectorImg,
  },
  {
    name: 'Agustín Fernández',
    location: 'Tucumán',
    model: 'XXXX',
    rating: 5,
    text: 'Uso la XXXX para trayectos medianos todos los días. Cómoda, potente y la batería cumple.',
    image: agustinImg,
  },
  {
    name: 'Ariel Martínez',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'La compré para hacer ejercicio. Me re enganché, ahora salgo varias veces por semana.',
    image: arielImg,
  },
  {
    name: 'Federico Jairala',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'Muy bien armada y con buena terminación. Roy Riff me atendió de primera de punta a punta.',
    image: federicoImg,
  },
  {
    name: 'Matías Salazar',
    location: 'Tucumán',
    model: 'XXXX',
    rating: 5,
    text: 'La XXXX me cambió el día a día. Trayectos que hacía en auto ahora los hago pedaleando.',
    image: matiasImg,
  },
  {
    name: 'Patricia Cigale',
    location: 'Tucumán',
    model: 'LOLA',
    rating: 5,
    text: 'Elegante y súper cómoda. Me encanta la sensación de salir a andar sin preocuparme por el tráfico.',
    image: patriciaImg,
  },
];

const AUTO_ROTATE_MS = 7000;
const PAGE_SIZE = 3;

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
    {/* Foto grande dominante con overlay */}
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-black/5">
      <img
        src={testimonial.image}
        alt={`${testimonial.name} con su Roy Riff ${testimonial.model}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Gradient + nombre + modelo */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-12">
        <p className="font-barlow font-black text-white text-xl md:text-2xl uppercase tracking-tight leading-tight">
          {testimonial.name}
        </p>
        <p className="font-neue text-white/90 text-sm mt-0.5">
          {testimonial.location} · <span className="font-bold text-primary-orange">{testimonial.model}</span>
        </p>
      </div>
    </div>

    {/* Bloque de texto */}
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex gap-0.5 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} className="w-4 h-4 fill-primary-yellow text-primary-yellow" />
        ))}
      </div>
      <p className="text-neutral-darkGreen text-sm md:text-base italic leading-relaxed">
        "{testimonial.text}"
      </p>
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
          subtitle="Clientes reales con sus bicis. Gente que ya eligió moverse distinto."
        />

        <div className="relative mt-4">
          {/* Botones prev/next (solo desktop) */}
          {pageCount > 1 && (
            <>
              <button
                type="button"
                aria-label="Testimonios anteriores"
                onClick={() => goTo(page - 1)}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-primary-orange hover:text-white text-neutral-black transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Testimonios siguientes"
                onClick={() => goTo(page + 1)}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-primary-orange hover:text-white text-neutral-black transition-colors"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
