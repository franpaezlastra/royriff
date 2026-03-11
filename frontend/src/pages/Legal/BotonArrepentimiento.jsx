import SectionTitle from '../../components/common/SectionTitle';

const BotonArrepentimiento = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle title="Botón de arrepentimiento" />
        <div className="bg-white p-8 rounded-lg shadow-md prose max-w-none">
          <p>Según la Ley de Defensa del Consumidor (Ley 24.240), tenés derecho a arrepentirte de tu compra dentro de los 10 días corridos desde la fecha de entrega del producto.</p>
          {/* TODO: Agregar formulario y contenido completo */}
        </div>
      </div>
    </div>
  );
};

export default BotonArrepentimiento;
