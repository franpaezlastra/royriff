import { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryTile from '../../Galeria/components/GalleryTile';
import GalleryLightbox from '../../Galeria/components/GalleryLightbox';
import { LOCAL_PHOTOS } from '../localData';

const LocalGalleryMasonry = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // La foto del equipo vive en otra fuente (TEAM_GROUP_PHOTO de la sesión
  // de Noviembre 2026), por lo que no es necesario excluirla del masonry.
  const items = LOCAL_PHOTOS;

  const openLightbox = (item) => {
    const idx = items.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const nextItem = () =>
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % items.length
    );
  const prevItem = () =>
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + items.length) % items.length
    );

  return (
    <section
      aria-labelledby="local-gallery-heading"
      className="bg-primary-beige py-16 md:py-24"
    >
      <div className="container-custom">
        {/* Heading block — eyebrow + H2 + line + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary-orange" />
            <span className="font-barlow font-black text-xs text-primary-orange uppercase tracking-[0.35em]">
              Nuestro local
            </span>
          </div>
          <h2
            id="local-gallery-heading"
            className="font-barlow font-black text-neutral-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.9] tracking-tighter mb-4"
          >
            Así es{' '}
            <span className="italic text-primary-orange">por&nbsp;dentro</span>
          </h2>
          <p className="font-neue text-neutral-darkGreen text-base md:text-lg max-w-2xl leading-relaxed">
            Recorré el local antes de venir. Espacios amplios, bicis expuestas,
            y el equipo siempre presente.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {items.map((item, idx) => (
            <GalleryTile
              key={item.id}
              item={item}
              index={idx}
              onClick={openLightbox}
              showIndex={true}
            />
          ))}
        </div>

        {/* Count footer — detalle editorial */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-barlow font-black text-[10px] text-neutral-darkGreen/60 uppercase tracking-[0.3em] text-center mt-10"
        >
          {String(items.length).padStart(2, '0')} fotos · Yerba Buena · Tucumán
        </motion.p>
      </div>

      <GalleryLightbox
        items={items}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextItem}
        onPrev={prevItem}
      />
    </section>
  );
};

export default LocalGalleryMasonry;
