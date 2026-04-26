import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../../../components/common/SectionTitle';
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
        <SectionTitle
          title="Nuestro local"
          subtitle="Recorré el local antes de venir. Espacios amplios, bicis expuestas, y el equipo siempre presente."
        />

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
