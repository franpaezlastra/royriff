import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SectionTitle from '../../../components/common/SectionTitle';
import Button from '../../../components/common/Button';
import { getProductMainImage } from '../../../utils/constants';
import { FiPackage } from 'react-icons/fi';

const LOLA_DATA = {
  title: 'LOLA',
  subtitle: 'Urban Cruiser (Ciudad)',
  bullets: [
    'Autonomía estimada: 40–65 km',
    'Rodado 26 x 3.0 Semi‑Fat (rodar suave en asfalto)',
    'Cuadro acero paso bajo + suspensión delantera',
    'Peso aprox: 32 kg',
  ],
  cta: 'Ver LOLA',
  slug: 'lola-cruiser',
};

const XXXX_DATA = {
  title: 'XXXX',
  subtitle: 'Compañera de aventuras todoterreno (Distancia + terreno)',
  bullets: [
    'Autonomía estimada: 70–90 km',
    'Batería 48V 20Ah (960Wh) + cargador rápido 3A',
    'Rodado 20 x 4.0 Fat Tire (tracción/estabilidad)',
    'Doble suspensión (horquilla doble corona + amortiguador trasero)',
    'Peso aprox: 42 kg',
  ],
  cta: 'Ver XXXX',
  slug: 'xxxx-expedition',
};

const ComparisonCard = ({ data, product, delay }) => {
  const mainImage = product ? getProductMainImage(product) : null;
  const slug = product?.slug || data.slug;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
    >
      {/* Imagen en cuadro con fondo blanco, object-contain */}
      <div className="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center p-2 md:p-3">
        {mainImage ? (
          <img
            src={mainImage}
            alt={data.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-black/20">
            <FiPackage className="w-16 h-16 mb-2" aria-hidden />
            <span className="font-barlow font-semibold text-sm">{data.title}</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="font-barlow font-black text-xl md:text-2xl text-neutral-black mb-0.5">
          {data.title}
        </h3>
        <p className="text-primary-orange font-neue font-medium text-sm mb-5">
          {data.subtitle}
        </p>
        <ul className="space-y-1.5 mb-6 text-neutral-darkGreen font-neue text-sm flex-1">
          {data.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary-orange mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button
          to={`/bicicletas-electricas/${slug}`}
          variant="primary"
          className="w-full rounded-xl py-3"
        >
          {data.cta}
        </Button>
      </div>
    </motion.article>
  );
};

const ComparisonSection = () => {
  const { items: products } = useSelector((state) => state.products);
  const lolaProduct = products?.find((p) => (p.slug || '').toLowerCase().includes('lola') || (p.name || '').toUpperCase().includes('LOLA'));
  const xxxxProduct = products?.find((p) => (p.slug || '').toLowerCase().includes('xxxx') || (p.name || '').toUpperCase().includes('XXXX'));

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F7]">
      <div className="container-custom">
        <SectionTitle
          title="Comparación rápida"
          subtitle="Conocé las diferencias y elegí la Roy Riff que va con vos."
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 mb-12">
          <ComparisonCard data={LOLA_DATA} product={lolaProduct} delay={0} />
          <ComparisonCard data={XXXX_DATA} product={xxxxProduct} delay={0.1} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center"
        >
          <Button
            to="/bicicletas-electricas/comparacion-ebike-royriff"
            variant="secondary"
            className="rounded-xl min-w-[180px]"
          >
            Ver más
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
