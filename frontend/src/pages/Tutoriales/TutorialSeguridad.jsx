import { useEffect } from 'react';
import TutorialLayout from '../../components/common/TutorialLayout';

const SectionH2 = ({ children }) => (
  <h2 className="font-barlow font-black text-xl md:text-2xl text-neutral-black uppercase mb-4 mt-2">
    {children}
  </h2>
);

const TutorialSeguridad = () => {
  useEffect(() => {
    document.title = 'Seguridad Antirrobo | Tutoriales Roy Riff';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Cómo asegurar tu bici, mejores candados y consejos para prevenir robos. Un buen U-Lock es tu seguro más barato.'
      );
    }
  }, []);

  return (
    <TutorialLayout
      title="Seguridad antirrobo"
      subtitle="Cómo asegurar tu bici, mejores candados y consejos para prevenir robos."
      topic="la seguridad antirrobo"
      intro={
        <>
          Tu Roy Riff llama la atención. Que no te la roben por descuidado. Un
          buen candado es tu <strong>seguro más barato</strong>.
        </>
      }
    >
      <section>
        <SectionH2>Olvidate de los cables</SectionH2>
        <p>
          Los candados de combinación, cadenas finas o cables de acero se cortan
          en segundos. La única opción real es un{' '}
          <strong>candado U-Lock de acero endurecido de alta calidad</strong>.
        </p>
      </section>

      <section>
        <SectionH2>Dónde y cómo atarla</SectionH2>
        <p className="mb-3">
          Buscá siempre una estructura sólida, anclada al suelo (un poste
          grueso, un bicicletero municipal). Asegurate de que{' '}
          <strong>no puedan levantar la bici por encima del poste</strong>.
        </p>
        <p>
          Atá siempre el U-Lock agarrando el <strong>cuadro principal</strong>{' '}
          (y la <strong>rueda trasera</strong> si es posible).
        </p>
      </section>

      <section>
        <SectionH2>Rueda delantera</SectionH2>
        <p>
          Si tu bici tiene eje de liberación rápida (<strong>Quick Release</strong>)
          en la rueda delantera, sacala y atala junto con el cuadro y la rueda
          trasera.
        </p>
      </section>

      <section>
        <SectionH2>Registrá tu nave</SectionH2>
        <p>
          Sacale una foto a color a tu Roy Riff, anotá el{' '}
          <strong>número de cuadro (Frame Number)</strong> y guardalo en un
          lugar seguro. Si alguna vez pasa lo peor, ese número es la única forma
          de que la policía la identifique y te la devuelva.
        </p>
      </section>
    </TutorialLayout>
  );
};

export default TutorialSeguridad;
