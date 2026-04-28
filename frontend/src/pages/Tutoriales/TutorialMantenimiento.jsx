import { useEffect } from 'react';
import TutorialLayout from '../../components/common/TutorialLayout';

const SectionH2 = ({ children }) => (
  <h2 className="font-barlow font-black text-xl md:text-2xl text-neutral-black uppercase mb-4 mt-2">
    {children}
  </h2>
);

const TutorialMantenimiento = () => {
  useEffect(() => {
    document.title = 'Mantenimiento Básico | Tutoriales Roy Riff';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Lubricación, presión de neumáticos y chequeo de frenos para que tu Roy Riff responda al 100%. Cuidados básicos para rodar seguro.'
      );
    }
  }, []);

  return (
    <TutorialLayout
      title="Mantenimiento básico"
      subtitle="Lubricación, presión de neumáticos y chequeo de frenos para rodar seguro."
      topic="el mantenimiento básico"
      intro={
        <>
          El asfalto y la tierra desgastan cualquier máquina. Para que tu Roy
          Riff responda siempre al 100%, tenés que darle un poco de amor
          regularmente.
        </>
      }
    >
      <section>
        <SectionH2>La presión manda (Neumáticos)</SectionH2>
        <p>
          Rodar desinflado te hace perder autonomía, daña la llanta y provoca
          pinchazos. Inflá la cubierta lentamente verificando que la línea del
          borde (<strong>bead line</strong>) quede pareja en toda la rueda.
          Respetá siempre la presión (<strong>PSI/KPA</strong>) que figura en el
          lateral del neumático.
        </p>
      </section>

      <section>
        <SectionH2>Chequeo de frenos (hidráulicos)</SectionH2>
        <p>
          Tu seguridad no es negociable. Antes de salir, apretá las manijas de
          freno. Deben sentirse <strong>firmes después de 4 a 5 milímetros de
          recorrido</strong>. Si se sienten "esponjosas" o la manija toca el
          puño, llevala a <strong>purgar</strong> a una bicicletería.
        </p>
      </section>

      <section>
        <SectionH2>Limpieza sin presión</SectionH2>
        <p>
          ¡Alejá la <strong>hidrolavadora</strong> de tu e-bike! El agua a
          presión arruina los rodamientos y la electrónica. Usá una{' '}
          <strong>esponja suave, agua y secá con un paño</strong>.
        </p>
      </section>

      <section>
        <SectionH2>Lubricación</SectionH2>
        <p>
          Mantené la <strong>cadena, el piñón libre y los puntos de pivote de
          los cambios (derailleur)</strong> lubricados. Cuidado: ¡que nunca caiga
          aceite en los <strong>discos de freno</strong>!
        </p>
      </section>
    </TutorialLayout>
  );
};

export default TutorialMantenimiento;
