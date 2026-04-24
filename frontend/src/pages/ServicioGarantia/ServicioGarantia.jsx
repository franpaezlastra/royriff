import SectionTitle from '../../components/common/SectionTitle';
import { WARRANTY_INFO } from '../../utils/constants';

const ServicioGarantia = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="2 años de cuadro. 1 año de electrónica. Soporte propio."
          subtitle="Garantía real, repuestos en stock, sin vueltas."
        />

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-bold text-2xl mb-4">Garantía Eléctrica</h3>
            <p className="mb-4">
              <strong>Duración:</strong> {WARRANTY_INFO.electric.duration}
            </p>
            <p className="mb-4">
              <strong>Cubre:</strong> {WARRANTY_INFO.electric.covers.join(', ')}
            </p>
            <p className="text-neutral-darkGreen">
              Tipo: {WARRANTY_INFO.electric.type}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="font-barlow font-bold text-2xl mb-4">Exclusiones</h3>
            <ul className="space-y-2 text-neutral-darkGreen">
              {WARRANTY_INFO.exclusions.map((exclusion, idx) => (
                <li key={idx}>• {exclusion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicioGarantia;
