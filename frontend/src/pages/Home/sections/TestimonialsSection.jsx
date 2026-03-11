import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';

const testimonials = [
  {
    name: 'Martín García',
    location: 'Buenos Aires',
    model: 'LOLA',
    rating: 5,
    text: 'La LOLA es perfecta para la ciudad. Me ahorro 2 horas de tráfico por día y llego fresco al trabajo. La autonomía es real, no chamuyo.',
    image: null // TODO: Agregar imagen real
  },
  {
    name: 'Luciana Fernández',
    location: 'Córdoba',
    model: 'XXXX',
    rating: 5,
    text: 'Compré la XXXX para hacer rutas largas los fines de semana. La batería de 20Ah es un game changer. Y el soporte de Roy Riff es de primera.',
    image: null
  },
  {
    name: 'Diego Romero',
    location: 'Rosario',
    model: 'LOLA',
    rating: 5,
    text: 'Excelente inversión. El cuadro paso bajo hace que sea súper cómoda para subir y bajar. Y los frenos hidráulicos son una tranquilidad.',
    image: null
  }
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
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-orange to-primary-yellow flex items-center justify-center text-white font-bold text-xl">
          {testimonial.name.charAt(0)}
        </div>
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
