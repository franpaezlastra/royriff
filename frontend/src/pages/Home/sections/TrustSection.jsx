import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiCreditCard, 
  FiTruck, 
  FiTool, 
  FiHelpCircle, 
  FiMapPin, 
  FiMail 
} from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';

const trustCards = [
  // Nivel A - Decisión de compra
  {
    icon: FiCreditCard,
    badge: 'Transparencia total',
    title: 'Cuotas y medios de pago',
    description: 'Precio claro. Sin "cuotas sin interés" que no son.',
    bullets: [
      { label: '6 cuotas fijas', text: '$402.000 LOLA · $536.167 XXXX' },
      { label: 'Efectivo o transferencia', text: '$2.000.000 LOLA · $2.700.000 XXXX (ahorrás 20%)' },
      { text: '3, 9 o 12 cuotas también disponibles · Todos los medios de pago · CFT aplicable' },
    ],
    link: '/financiacion',
    cta: 'Ver financiación',
    level: 'A'
  },
  {
    icon: FiTruck,
    badge: 'Envío gratis en todo el país',
    title: 'Envíos y retiro',
    description: 'Nosotros nos hacemos cargo. Vos la recibís o la retirás.',
    bullets: [
      { label: 'Envío gratis', text: 'a cualquier código postal de Argentina' },
      { label: 'Retiro en Palermo, BsAs', text: 'con turno previo por WhatsApp' },
      { text: 'Llega 85–90% armada con manual + videos de armado' },
    ],
    link: '/envios',
    cta: 'Ver envíos y armado',
    level: 'A'
  },
  {
    icon: FiTool,
    badge: 'Hasta 2 años de garantía',
    title: 'Service y garantía',
    description: 'Soporte propio, repuestos en stock, sin vueltas.',
    bullets: [
      { label: 'Cuadro', text: '2 años por defectos de fábrica' },
      { label: 'Motor, batería y controller', text: '1 año' },
      { label: 'Mecánica cubierta', text: 'por cualquier bicicletería' },
    ],
    link: '/servicio-tecnico-y-garantia',
    cta: 'Ver garantía y service',
    level: 'A'
  },
  // Nivel B - Soporte/Legitimidad
  {
    icon: FiHelpCircle,
    badge: 'Por modelo + generales',
    title: 'Preguntas frecuentes',
    description: 'Respuestas directas, sin tecnicismos.',
    bullets: [
      { label: 'LOLA vs XXXX', text: 'cuál te conviene según tu uso' },
      { label: 'Autonomía real', text: 'cuánto andás con una carga' },
      { label: 'Cuidados y uso real', text: 'lluvia, carga, mantenimiento' },
    ],
    link: '/faq',
    cta: 'Ir a FAQ',
    level: 'B'
  },
  {
    icon: FiMapPin,
    badge: 'Con turno',
    title: 'Test ride y showroom',
    description: 'Probala antes de decidir. En Tucumán o BsAs.',
    bullets: [
      { label: 'Yerba Buena, Tucumán', text: 'test ride oficial con turno' },
      { label: 'Palermo, Buenos Aires', text: 'visita al depósito con confirmación previa' },
      { label: 'Coordinamos horario', text: 'por WhatsApp o mail' },
    ],
    link: '/test-ride-tucuman',
    cta: 'Agendar visita',
    level: 'B'
  },
  {
    icon: FiMail,
    badge: 'Atención al cliente',
    title: 'Contacto',
    description: 'Escribinos. Respondemos con la posta.',
    bullets: [
      { label: 'WhatsApp', text: '+54 9 381 200 6514' },
      { label: 'Email', text: 'postventa@royriff.com.ar' },
      { label: 'Horarios', text: 'L–V 9 a 13 y 17 a 21 · Sábados 9 a 13' },
    ],
    link: '/contacto',
    cta: 'Ver contacto',
    level: 'B'
  }
];

const TrustCard = ({ card, index }) => {
  const Icon = card.icon;
  const isLevelA = card.level === 'A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 ${
        isLevelA ? 'border-primary-orange/20' : 'border-neutral-gray/20'
      }`}
    >
      {/* Icon & Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-full ${isLevelA ? 'bg-primary-orange' : 'bg-neutral-darkGreen'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isLevelA ? 'bg-primary-orange text-white' : 'bg-neutral-gray text-neutral-black'
        }`}>
          {card.badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-barlow font-bold text-xl text-neutral-black mb-2">
        {card.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-darkGreen mb-4">
        {card.description}
      </p>

      {/* Bullets */}
      <ul className="space-y-2 mb-6 text-sm text-neutral-darkGreen">
        {card.bullets.map((bullet, idx) => {
          const isObject = typeof bullet === 'object' && bullet !== null;
          const label = isObject ? bullet.label : null;
          const text = isObject ? bullet.text : bullet;
          return (
            <li key={idx} className="flex items-start">
              <span className="text-primary-orange mr-2">•</span>
              <span>
                {label && <strong className="font-bold text-neutral-black">{label}: </strong>}
                {text}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <Link
        to={card.link}
        className={`inline-block w-full text-center font-bold py-3 rounded-md transition-smooth ${
          isLevelA
            ? 'bg-primary-orange text-white hover:bg-[#E03D0B]'
            : 'bg-transparent text-primary-orange border-2 border-primary-orange hover:bg-primary-orange hover:text-white'
        }`}
      >
        {card.cta}
      </Link>
    </motion.div>
  );
};

const TrustSection = () => {
  const levelACards = trustCards.filter(card => card.level === 'A');
  const levelBCards = trustCards.filter(card => card.level === 'B');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-beige">
      <div className="container-custom">
        <SectionTitle
          title="Financiación, envíos a todo el país y soporte post venta garantizado"
          subtitle="Explorá toda nuestra información comercial y de asistencia técnica."
        />

        {/* Nivel A - Decisión */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {levelACards.map((card, index) => (
            <TrustCard key={card.title} card={card} index={index} />
          ))}
        </div>

        {/* Nivel B - Soporte */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {levelBCards.map((card, index) => (
            <TrustCard key={card.title} card={card} index={index + 3} />
          ))}
        </div>

        {/* Micro-links legales */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-neutral-darkGreen"
        >
          <Link to="/cambios-y-devoluciones" className="hover:text-primary-orange transition-smooth">
            Cambios y devoluciones
          </Link>
          <span>•</span>
          <Link to="/boton-de-arrepentimiento" className="hover:text-primary-orange transition-smooth">
            Botón de arrepentimiento (10 días)
          </Link>
          <span>•</span>
          <Link to="/politica-de-privacidad" className="hover:text-primary-orange transition-smooth">
            Privacidad
          </Link>
          <span>•</span>
          <Link to="/terminos-y-condiciones" className="hover:text-primary-orange transition-smooth">
            Términos
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
