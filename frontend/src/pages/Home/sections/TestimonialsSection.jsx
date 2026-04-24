import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';
import hectorImg from '../../../assets/testimonios/hector-gramajo.webp';
import agustinImg from '../../../assets/testimonios/agustin-fernandez.webp';
import arielImg from '../../../assets/testimonios/ariel-martinez.webp';

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
];

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md p-6 border-2 border-neutral-gray/20 hover:border-primary-orange transition-all duration-300"
    >
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} className="w-5 h-5 fill-primary-yellow text-primary-yellow" />
        ))}
      </div>

      {/* Text */}
      <p className="text-neutral-darkGreen mb-6 italic">
        "{testimonial.text}"
      </p>

      {/* Author */}
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
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary-beige to-white">
      <div className="container-custom">
        <SectionTitle
          title="Lo que dicen los RoyRiffers"
          subtitle="Historias reales de quienes ya disfrutan su libertad sobre dos ruedas."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
