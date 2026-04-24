import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMapPin, FiClock, FiTruck, FiExternalLink } from 'react-icons/fi';
import { CONTACT_INFO } from '../../../utils/constants';

const HOURS = [
  { label: 'Lunes a viernes', value: '9:00 – 13:00 · 17:00 – 21:00' },
  { label: 'Sábados', value: '9:00 – 13:00' },
  { label: 'Domingos', value: 'Cerrado' },
];

const LocalInfoSection = () => {
  const whatsappVisita = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
    'Hola! Me gustaría visitar el local de Roy Riff en Yerba Buena.'
  )}`;

  return (
    <section
      id="info-practica"
      aria-labelledby="local-info-heading"
      className="bg-primary-beige py-16 md:py-24 scroll-mt-20"
    >
      <div className="container-custom">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary-orange" />
            <span className="font-barlow font-black text-xs text-primary-orange uppercase tracking-[0.35em]">
              Cómo llegar
            </span>
          </div>
          <h2
            id="local-info-heading"
            className="font-barlow font-black text-neutral-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.9] tracking-tighter"
          >
            Yerba Buena,{' '}
            <span className="italic text-primary-orange">Tucumán.</span>
          </h2>
        </motion.div>

        {/* Grid 2 col: info + mapa */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 md:p-8 flex flex-col gap-6"
          >
            {/* Dirección */}
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-orange/10 flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-primary-orange" />
              </span>
              <div>
                <h3 className="font-barlow font-black text-neutral-black text-sm uppercase tracking-[0.25em] mb-2">
                  Dirección
                </h3>
                <p className="font-neue text-neutral-darkGreen text-base leading-relaxed">
                  {CONTACT_INFO.address}
                </p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-orange/10 flex items-center justify-center">
                <FiClock className="w-5 h-5 text-primary-orange" />
              </span>
              <div className="flex-1">
                <h3 className="font-barlow font-black text-neutral-black text-sm uppercase tracking-[0.25em] mb-2">
                  Horarios
                </h3>
                <dl className="space-y-1 font-neue text-sm md:text-base">
                  {HOURS.map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-neutral-darkGreen">{label}</dt>
                      <dd className="text-neutral-black font-medium text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Parking */}
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-orange/10 flex items-center justify-center">
                <FiTruck className="w-5 h-5 text-primary-orange" />
              </span>
              <div>
                <h3 className="font-barlow font-black text-neutral-black text-sm uppercase tracking-[0.25em] mb-2">
                  Parking
                </h3>
                <p className="font-neue text-neutral-darkGreen text-base leading-relaxed">
                  Tenemos parking propio. Venís en auto tranquilo.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
              <a
                href={CONTACT_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-neutral-black hover:bg-neutral-darkGreen text-white font-barlow font-black uppercase tracking-wide text-sm py-3 px-5 rounded-full transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                Google Maps
              </a>
              <a
                href={whatsappVisita}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary-orange hover:bg-[#E03D0B] text-white font-barlow font-black uppercase tracking-wide text-sm py-3 px-5 rounded-full transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                Coordinar visita
              </a>
            </div>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-lg overflow-hidden shadow-sm bg-neutral-black/5 min-h-[360px] md:min-h-0"
          >
            <iframe
              title="Mapa — Roy Riff Local Yerba Buena"
              src={CONTACT_INFO.googleMapsEmbedSrc}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalInfoSection;
