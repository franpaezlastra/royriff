import { useEffect } from 'react';
import TutorialLayout from '../../components/common/TutorialLayout';

const SectionH2 = ({ children }) => (
  <h2 className="font-barlow font-black text-xl md:text-2xl text-neutral-black uppercase mb-4 mt-2">
    {children}
  </h2>
);

const TutorialBateria = () => {
  useEffect(() => {
    document.title = 'Batería y Carga | Tutoriales Roy Riff';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Buenas prácticas de carga, cuidados y qué NO hacer para maximizar la vida útil de la batería de tu LOLA o XXXX.'
      );
    }
  }, []);

  return (
    <TutorialLayout
      title="Batería y carga"
      subtitle="Buenas prácticas de carga, cuidados y qué NO hacer para maximizar la vida útil."
      topic="la batería y la carga"
      intro={
        <>
          Nuestras baterías de Litio de alta densidad (tanto la de{' '}
          <strong>10.4 Ah de LOLA</strong> como la gigante de{' '}
          <strong>20 Ah de la XXXX</strong>) son el corazón de tu E-Bike.
          Cuidalas y te van a llevar muy lejos.
        </>
      }
    >
      <section>
        <SectionH2>El frío y el calor extremos son el enemigo</SectionH2>
        <p>
          No dejes tu bici (ni tu batería) expuesta bajo el rayo del sol directo
          por horas. Si hace mucho frío (temperaturas bajo cero), la batería
          puede descargarse rápido o congelarse; guardala en un lugar donde la
          temperatura esté <strong>por encima de los 5°C - 15°C</strong>.
        </p>
      </section>

      <section>
        <SectionH2>No la dejes morir</SectionH2>
        <p>
          Nunca guardes la batería completamente descargada. Si vas a estar un
          tiempo sin usar tu Roy Riff (por ejemplo, 3 o 4 meses), guardala con
          carga y dale una <strong>recarga preventiva</strong> para mantener
          las celdas vivas.
        </p>
      </section>

      <section>
        <SectionH2>Solo el cargador original</SectionH2>
        <p>
          Usá siempre el cargador Roy Riff (de <strong>2.0 A para LOLA</strong>{' '}
          o de <strong>Carga Rápida 3.0 A para XXXX</strong>). Usar cargadores
          genéricos anula la garantía y es peligroso.
        </p>
      </section>

      <section>
        <SectionH2>Seguridad al lavar</SectionH2>
        <p>
          Si vas a lavar la bici, sacá la batería o asegurate de sacar cualquier
          objeto de valor del portaequipajes o caja, y evitá que el agua a
          presión golpee los contactos.
        </p>
      </section>
    </TutorialLayout>
  );
};

export default TutorialBateria;
