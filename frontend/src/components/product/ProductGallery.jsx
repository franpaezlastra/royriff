import { useState, useMemo } from 'react';
import { FiMaximize2 } from 'react-icons/fi';
import GalleryLightbox from '../../pages/Galeria/components/GalleryLightbox';

const ProductGallery = ({ eyebrow, title, subtitle, images, productName }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxItems = useMemo(
    () =>
      images.map((src, i) => ({
        id: `prod-gal-${i}`,
        type: 'image',
        src,
        category: 'producto',
        title: `${productName} · ${i + 1} de ${images.length}`,
      })),
    [images, productName]
  );

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));
  };
  const handlePrev = () => {
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + images.length) % images.length
    );
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <p className="font-barlow font-bold text-xs sm:text-[13px] tracking-[0.25em] text-primary-orange uppercase mb-4">
          {eyebrow}
        </p>
        <h2 className="font-barlow font-black text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] tracking-tight text-neutral-black uppercase mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed mb-9 md:mb-10 max-w-xl">
            {subtitle}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[auto] md:grid-rows-2 gap-2.5 md:gap-3 md:auto-rows-[230px] lg:md:auto-rows-[260px]">
          {images.map((src, i) => {
            const isFeatured = i === 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Abrir foto ${i + 1} de ${productName}`}
                className={`group relative overflow-hidden rounded-xl bg-neutral-darkGreen/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange ${
                  isFeatured
                    ? 'col-span-2 md:col-span-1 md:row-span-2 aspect-[4/3] md:aspect-auto'
                    : 'aspect-[4/3] md:aspect-auto'
                }`}
              >
                <img
                  src={src}
                  alt={`${productName} — vista ${i + 1}`}
                  loading={isFeatured ? 'eager' : 'lazy'}
                  fetchpriority={isFeatured ? 'high' : 'auto'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="hidden md:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center text-neutral-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  <FiMaximize2 className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <GalleryLightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};

export default ProductGallery;
