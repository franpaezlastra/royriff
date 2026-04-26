import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCheck, FiHelpCircle } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';
import { CONTACT_INFO } from '../../../utils/constants';

const STEPS = [
  {
    num: '01',
    title: 'Agendás',
    desc: 'Nos escribís por WhatsApp y elegimos día y hora juntos.',
  },
  {
    num: '02',
    title: 'Venís',
    desc: 'Llegás al local en Yerba Buena. Te esperamos con tu modelo listo.',
  },
  {
    num: '03',
    title: 'Probás',
    desc: 'Subís a la LOLA o la XXXX y salimos a andar por la zona.',
  },
  {
    num: '04',
    title: 'Decidís',
    desc: 'Sin apuro, sin presión. Te contestamos todo antes de comprar.',
  },
];

const BENEFITS = [
  'Gratis y sin compromiso',
  '15 minutos por modelo',
  'Asesoría real sobre autonomía',
  'Parking propio en el local',
];

const LocalTestDriveSection = () => {
  const whatsappTestDrive = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
    'Hola! Quiero agendar un test drive en el local de Yerba Buena. ¿Qué día y hora tienen disponible?'
  )}`;

  return (
    <section
      id="test-drive"
      aria-labelledby="test-drive-heading"
      className="relative bg-primary-beige text-neutral-black py-20 md:py-28 overflow-hidden scroll-mt-20"
    >
      <div className="relative container-custom">
        <SectionTitle
          title="Cómo funciona el test drive"
          subtitle="Sin compromiso, con turno, en 4 pasos simples."
        />

        {/* Stepper grid — cards blancas con número outline naranja gigante */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-14 md:mb-16">
          {STEPS.map((step, idx) => (
            <motion.article
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative bg-white border border-neutral-gray/20 rounded-lg p-6 md:p-7 pt-14 md:pt-16 overflow-hidden hover:border-primary-orange/50 hover:shadow-md transition-all"
            >
              {/* Número outline naranja gigante en esquina */}
              <span
                aria-hidden="true"
                className="absolute -top-3 -right-2 font-barlow font-black leading-none select-none pointer-events-none"
                style={{
                  fontSize: 'clamp(7rem, 14vw, 10rem)',
                  WebkitTextStroke: '2px rgba(255, 70, 13, 0.18)',
                  color: 'transparent',
                }}
              >
                {step.num}
              </span>
              {/* Número chico con bar naranja */}
              <div className="relative flex items-center gap-2 mb-4">
                <span className="h-px w-6 bg-primary-orange" />
                <span className="font-barlow font-black text-primary-orange text-sm tracking-[0.3em]">
                  {step.num}
                </span>
              </div>
              <h3 className="relative font-barlow font-black text-neutral-black text-2xl md:text-3xl uppercase mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="relative font-neue text-neutral-darkGreen text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Benefits block — card blanca con sombra suave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-neutral-gray/20 shadow-sm rounded-lg p-6 md:p-8 mb-10 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-primary-orange" />
            <span className="font-barlow font-black text-[10px] md:text-xs text-primary-orange uppercase tracking-[0.35em]">
              Qué incluye
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 font-neue text-neutral-black text-base md:text-lg"
              >
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary-orange flex items-center justify-center">
                  <FiCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={whatsappTestDrive}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-primary-orange hover:bg-[#E03D0B] text-white font-barlow font-black uppercase tracking-wide text-base py-4 px-8 rounded-full transition-colors shadow-[0_8px_32px_rgba(255,70,13,0.35)]"
          >
            <FaWhatsapp className="w-5 h-5" />
            Agendar turno
          </a>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 border-2 border-neutral-black/25 hover:border-neutral-black text-neutral-black font-barlow font-black uppercase tracking-wide text-sm py-3.5 px-7 rounded-full transition-colors"
          >
            <FiHelpCircle className="w-4 h-4" />
            Preguntas frecuentes
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LocalTestDriveSection;
