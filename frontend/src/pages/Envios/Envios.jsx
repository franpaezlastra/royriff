import SectionTitle from '../../components/common/SectionTitle';
import { SHIPPING_INFO } from '../../utils/constants';

const Envios = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Envíos a todo el país"
          subtitle="Tu Roy Riff llega lista para rodar. Envío seguro y rápido."
        />

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h3 className="font-barlow font-bold text-2xl mb-4">Información de envío</h3>
          <ul className="space-y-3 text-neutral-darkGreen">
            <li>• <strong>Cobertura:</strong> {SHIPPING_INFO.coverage}</li>
            <li>• <strong>Tiempo de entrega:</strong> {SHIPPING_INFO.deliveryTime}</li>
            <li>• <strong>Estado de armado:</strong> {SHIPPING_INFO.assemblyLevel} pre-armada</li>
            <li>• <strong>Incluye:</strong> {SHIPPING_INFO.includes.join(', ')}</li>
            <li>• <strong>Recomendación:</strong> {SHIPPING_INFO.recommendation}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Envios;
