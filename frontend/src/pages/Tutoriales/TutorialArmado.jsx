import { useEffect } from 'react';
import TutorialLayout from '../../components/common/TutorialLayout';

const SectionH2 = ({ children }) => (
  <h2 className="font-barlow font-black text-xl md:text-2xl text-neutral-black uppercase mb-4 mt-2">
    {children}
  </h2>
);

const TutorialArmado = () => {
  useEffect(() => {
    document.title = 'Armado y Ajuste Final | Tutoriales Roy Riff';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Unboxing completo y ajuste recomendado para dejar tu Roy Riff lista para rodar. Reglas de oro para rueda delantera, manubrio, pedales y asiento.'
      );
    }
  }, []);

  return (
    <TutorialLayout
      title="Armado y ajuste final"
      subtitle="Unboxing completo y ajuste recomendado para dejar tu bici lista para rodar."
      topic="el armado y ajuste final"
      intro={
        <>
          ¡Llegó tu Roy Riff! Tu nave viaja pre-ensamblada casi al 90%, pero los
          toques finales son clave para tu seguridad y para no romper nada antes
          de salir a la calle. Si no te sentís seguro, llevala a tu bicicletero
          de confianza. Si te das maña, seguí estas reglas de oro.
        </>
      }
    >
      <section>
        <SectionH2>Rueda delantera</SectionH2>
        <p>
          Asegurate de que el <strong>disco de freno quede del mismo lado que el
          caliper</strong> (la pinza de freno). Prestá atención a la{' '}
          <strong>"arandela con pestaña" (tabbed washer)</strong>: esa pestaña
          debe encajar perfectamente en el orificio de seguridad de la horquilla.
          Ajustá las tuercas o el cierre rápido (Quick Release) con firmeza.
        </p>
      </section>

      <section>
        <SectionH2>Manubrio (Stem)</SectionH2>
        <p>
          Retirá la placa frontal y ubicá el manubrio. ¡Ojo acá! Los{' '}
          <strong>cables no deben quedar retorcidos alrededor de la horquilla</strong>.
          Ajustá los tornillos <strong>en forma de cruz</strong> de manera
          uniforme.
        </p>
      </section>

      <section>
        <SectionH2>El truco de los pedales (VITAL)</SectionH2>
        <p className="mb-3">
          Muchos arruinan la rosca por no saber esto:
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-3">
          <li>
            El <strong>pedal Derecho (R)</strong> se enrosca en{' '}
            <strong>sentido horario</strong> (como un tornillo normal).
          </li>
          <li>
            El <strong>pedal Izquierdo (L)</strong> se enrosca en{' '}
            <strong>sentido anti-horario</strong> (hacia la izquierda).
          </li>
        </ul>
        <p>
          Apretalos lo más fuerte que puedas con una llave de <strong>15 mm</strong>.
        </p>
      </section>

      <section>
        <SectionH2>Asiento</SectionH2>
        <p>
          Ajustalo a tu altura ideal: tu rodilla debe quedar{' '}
          <strong>levemente flexionada cuando el pedal está abajo del todo</strong>.
          Nunca subas el asiento por encima de la marca de{' '}
          <strong>"Inserción Mínima"</strong> grabada en el caño.
        </p>
      </section>
    </TutorialLayout>
  );
};

export default TutorialArmado;
