import { Link } from 'react-router-dom';
import SectionTitle from '../../components/common/SectionTitle';
import { FiTool, FiBatteryCharging, FiSettings, FiShield } from 'react-icons/fi';

const tutorials = [
  { icon: FiTool, title: 'Armado', link: '/tutoriales/armado' },
  { icon: FiBatteryCharging, title: 'Batería y carga', link: '/tutoriales/bateria-y-carga' },
  { icon: FiSettings, title: 'Mantenimiento básico', link: '/tutoriales/mantenimiento-basico' },
  { icon: FiShield, title: 'Seguridad antirrobo', link: '/tutoriales/seguridad-antirrobo' }
];

const Tutoriales = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        <SectionTitle title="Tutoriales" subtitle="Aprende a cuidar y mantener tu Roy Riff" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorials.map((tut) => {
            const Icon = tut.icon;
            return (
              <Link key={tut.link} to={tut.link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-smooth">
                <Icon className="w-12 h-12 text-primary-orange mb-4" />
                <h3 className="font-bold">{tut.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tutoriales;
