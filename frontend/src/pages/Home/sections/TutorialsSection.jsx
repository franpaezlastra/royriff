import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTool, FiBatteryCharging, FiSettings, FiShield } from 'react-icons/fi';
import SectionTitle from '../../../components/common/SectionTitle';

const tutorials = [
  {
    icon: FiTool,
    title: 'Armado y ajuste final',
    description: 'Unboxing completo y ajuste recomendado para dejar tu bici lista para rodar.',
    duration: '10-20 min',
    link: '/tutoriales/armado',
    color: 'bg-primary-orange'
  },
  {
    icon: FiBatteryCharging,
    title: 'Batería y carga',
    description: 'Buenas prácticas de carga, cuidados y qué NO hacer para maximizar la vida útil.',
    duration: '5-8 min',
    link: '/tutoriales/bateria-y-carga',
    color: 'bg-primary-yellow'
  },
  {
    icon: FiSettings,
    title: 'Mantenimiento básico',
    description: 'Lubricación, presión de neumáticos y chequeo de frenos para rodar seguro.',
    duration: '8-12 min',
    link: '/tutoriales/mantenimiento-basico',
    color: 'bg-neutral-darkGreen'
  },
  {
    icon: FiShield,
    title: 'Seguridad antirrobo',
    description: 'Cómo asegurar tu bici, mejores candados y consejos para prevenir robos.',
    duration: '6-10 min',
    link: '/tutoriales/seguridad-antirrobo',
    color: 'bg-neutral-black'
  }
];

const TutorialCard = ({ tutorial, index }) => {
  const Icon = tutorial.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        to={tutorial.link}
        className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-primary-orange"
      >
        {/* Icon Header */}
        <div className={`${tutorial.color} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-full h-full scale-150 transform rotate-12" />
          </div>
          <div className="relative flex items-center justify-between">
            <Icon className="w-12 h-12 text-white" />
            <span className="text-white text-sm font-bold bg-black/20 px-3 py-1 rounded-full">
              {tutorial.duration}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-barlow font-bold text-xl text-neutral-black mb-2 group-hover:text-primary-orange transition-smooth">
            {tutorial.title}
          </h3>
          <p className="text-sm text-neutral-darkGreen mb-4">
            {tutorial.description}
          </p>
          <div className="flex items-center text-primary-orange font-bold text-sm group-hover:translate-x-2 transition-transform">
            Ver tutorial →
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const TutorialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <SectionTitle
          title="Tutoriales y soporte"
          subtitle="Aprende a sacarle el máximo provecho a tu Roy Riff. Videos paso a paso, sin vueltas."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tutorials.map((tutorial, index) => (
            <TutorialCard key={tutorial.title} tutorial={tutorial} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/tutoriales"
            className="inline-block text-primary-orange font-bold border-b-2 border-primary-orange hover:text-[#E03D0B] hover:border-[#E03D0B] transition-smooth"
          >
            Ver todos los tutoriales
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TutorialsSection;
