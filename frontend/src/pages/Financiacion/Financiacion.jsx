import SectionTitle from '../../components/common/SectionTitle';
import { PAYMENT_METHODS } from '../../utils/constants';

const Financiacion = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle
          title="Financiación y medios de pago"
          subtitle="Elegí cómo pagar tu Roy Riff. Sin sorpresas."
        />

        <div className="space-y-8">
          {Object.values(PAYMENT_METHODS).map((method) => (
            <div key={method.name} className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="font-barlow font-bold text-2xl mb-2">{method.name}</h3>
              <p className="text-neutral-darkGreen">{method.description}</p>
              {method.installments && (
                <p className="text-primary-orange font-bold mt-2">
                  Hasta {method.installments} cuotas
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financiacion;
