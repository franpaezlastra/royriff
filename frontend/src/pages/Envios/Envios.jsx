import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiTruck, FiMapPin, FiPackage, FiTool } from 'react-icons/fi';
import SectionTitle from '../../components/common/SectionTitle';
import { CONTACT_INFO } from '../../utils/constants';

const whatsappRetiro = `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
  'Hola! Vivo en BsAs y me gustaría coordinar el retiro de una Roy Riff desde Palermo.'
)}`;

const Envios = () => {
  return (
    <div className="py-12 md:py-20 bg-primary-beige">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Llega a tu puerta o la retirás en Palermo"
          subtitle="Envío gratis a todo el país. Sin sorpresas en el checkout."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-8 mb-8">
          {/* Envío a domicilio */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-barlow font-black text-xl text-neutral-black uppercase">
                Envío a domicilio
              </h3>
            </div>
            <ul className="space-y-2 font-neue text-neutral-darkGreen text-sm leading-relaxed">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span><strong className="text-neutral-black">Gratis</strong> a cualquier código postal de Argentina.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span><strong className="text-neutral-black">Tiempo de entrega:</strong> 3 a 6 días hábiles según zona.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span><strong className="text-neutral-black">Embalaje seguro</strong> + herramientas básicas incluidas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span><strong className="text-neutral-black">Llega 85–90% armada</strong>, con manual + videos tutoriales.</span>
              </li>
            </ul>
          </div>

          {/* Retiro en Palermo */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral-darkGreen flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-barlow font-black text-xl text-neutral-black uppercase">
                Retiro en Palermo, BsAs
              </h3>
            </div>
            <ul className="space-y-2 font-neue text-neutral-darkGreen text-sm leading-relaxed">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span>Si vivís en Buenos Aires y preferís retirar, coordinamos la fecha con vos.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span><strong className="text-neutral-black">Con turno previo</strong> por WhatsApp. Te pasamos la dirección exacta al coordinar.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">•</span>
                <span>Podés ver la bici, hacer preguntas y llevártela el mismo día.</span>
              </li>
            </ul>
            <a
              href={whatsappRetiro}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 mt-5 bg-primary-orange text-white font-bold py-2.5 px-5 rounded-full hover:bg-[#E03D0B] transition-smooth text-sm"
            >
              <FaWhatsapp className="w-4 h-4" />
              Coordinar retiro
            </a>
          </div>
        </div>

        {/* Armado y ajuste */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-orange/10 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-primary-orange" />
            </div>
            <h3 className="font-barlow font-black text-lg text-neutral-black uppercase">
              Armado y ajuste
            </h3>
          </div>
          <p className="font-neue text-neutral-darkGreen text-sm leading-relaxed">
            La bici llega pre-armada al 85–90%. En la caja vienen el manual paso a paso y el link a nuestros
            videos de armado. Para el <strong>ajuste final</strong> (frenos finos, alineación de rueda) recomendamos
            llevarla a una bicicletería de confianza — son 20 minutos de trabajo y te aseguran que salga perfecta
            para rodar.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              to="/tutoriales/armado"
              className="inline-flex items-center gap-2 bg-neutral-black text-white font-bold py-2.5 px-5 rounded-full hover:bg-neutral-darkGreen transition-smooth text-sm"
            >
              <FiTool className="w-4 h-4" />
              Ver tutorial de armado
            </Link>
          </div>
        </div>

        {/* CTA final */}
        <div className="bg-white/60 border border-neutral-gray/30 rounded-lg p-6 text-center">
          <p className="font-neue text-neutral-darkGreen text-sm mb-4">
            ¿Dudas de cómo te llega o cuánto tarda? Escribinos por WhatsApp y te contamos todo antes de comprar.
          </p>
          <a
            href={CONTACT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary-orange text-white font-bold py-3 px-6 rounded-full hover:bg-[#E03D0B] transition-smooth"
          >
            <FaWhatsapp className="w-5 h-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Envios;
