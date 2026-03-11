import SectionTitle from '../../components/common/SectionTitle';

const TutorialArmado = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        <SectionTitle title="Tutorial: Armado y ajuste final" />
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-neutral-darkGreen mb-4">
            Contenido del tutorial de armado (videos, pasos, etc.)
          </p>
          {/* TODO: Agregar contenido detallado */}
        </div>
      </div>
    </div>
  );
};

export default TutorialArmado;
