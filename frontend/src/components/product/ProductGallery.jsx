import { useState, useMemo } from 'react';
import { FiPlay } from 'react-icons/fi';
import GalleryLightbox from '../../pages/Galeria/components/GalleryLightbox';

/**
 * Sección audiovisual del PDP — opcionalmente un video destacado fullbleed
 * con créditos sobrios + galería uniforme 5×2 con créditos del fotógrafo.
 *
 * Layout V1 (definido en sesión brainstorm 2026-05-06):
 *   1. Video fullbleed (si video.src existe) con play centrado, sin badge
 *   2. Créditos sobrios debajo del video (production + filmmaker)
 *   3. Gap respirable
 *   4. Galería con header propio + grid uniforme + crédito del fotógrafo
 *
 * Click en video o en cualquier foto abre GalleryLightbox (theater fullscreen).
 */
const ProductGallery = ({ video, gallery, productName }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const hasVideo = Boolean(video?.src);
  const images = gallery?.images || [];

  const lightboxItems = useMemo(() => {
    const items = [];
    if (hasVideo) {
      items.push({
        id: 'prod-video',
        type: 'video',
        src: video.src,
        category: 'producto',
        title: `${productName} · video`,
      });
    }
    images.forEach((src, i) => {
      items.push({
        id: `prod-img-${i}`,
        type: 'image',
        src,
        category: 'producto',
        title: `${productName} · foto ${i + 1} de ${images.length}`,
      });
    });
    return items;
  }, [hasVideo, video, images, productName]);

  if (!hasVideo && images.length === 0) return null;

  const handleNext = () => {
    setLightboxIndex((i) =>
      i === null ? 0 : (i + 1) % lightboxItems.length
    );
  };
  const handlePrev = () => {
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + lightboxItems.length) % lightboxItems.length
    );
  };

  return (
    <>
      {/* ═══════════ BLOQUE VIDEO (opcional) ═══════════ */}
      {hasVideo && (
        <section className="bg-white pt-10 md:pt-14">
          {/* Wrapper fullbleed: rompe el container y ocupa el viewport completo */}
          <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#0a0a0a]">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`Reproducir video de ${productName}`}
              className="group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-orange/60"
            >
              <div className="relative aspect-video md:aspect-[21/9] md:max-h-[420px] w-full">
                {video.poster ? (
                  <img
                    src={video.poster}
                    alt={`${productName} — video`}
                    loading="eager"
                    fetchpriority="high"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-70"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-black" />
                )}
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <FiPlay className="w-7 h-7 md:w-8 md:h-8 text-neutral-black ml-1" />
                  </span>
                </span>
              </div>
            </button>
          </div>

          {/* Créditos del video (sobrios) */}
          {video.credits && (
            <div className="container-custom pt-4">
              <p className="font-neue text-[12px] text-neutral-darkGreen leading-relaxed m-0">
                Producción Roy Riff
                {video.credits.location ? ` · ${video.credits.location}` : ''}
                {video.credits.period ? ` · ${video.credits.period}` : ''}
              </p>
              {video.credits.filmmaker && (
                <p className="font-neue text-[12px] text-neutral-darkGreen leading-relaxed m-0">
                  Filmmaker:{' '}
                  <strong className="text-neutral-black font-semibold">
                    {video.credits.filmmaker}
                  </strong>
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ═══════════ GAP entre video y galería ═══════════ */}
      {hasVideo && images.length > 0 && (
        <div className="bg-white h-12 md:h-16" aria-hidden="true" />
      )}

      {/* ═══════════ BLOQUE GALERÍA ═══════════ */}
      {images.length > 0 && gallery && (
        <section
          className={`bg-white ${hasVideo ? 'pb-16 md:pb-24' : 'py-16 md:py-24'}`}
        >
          <div className="container-custom">
            {gallery.eyebrow && (
              <p className="font-barlow font-bold text-xs sm:text-[13px] tracking-[0.25em] text-primary-orange uppercase mb-4">
                {gallery.eyebrow}
              </p>
            )}
            {gallery.title && (
              <h2 className="font-barlow font-black text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] tracking-tight text-neutral-black uppercase mb-3">
                {gallery.title}
              </h2>
            )}
            {gallery.subtitle && (
              <p className="font-neue text-neutral-darkGreen text-base md:text-lg leading-relaxed mb-9 md:mb-10 max-w-xl">
                {gallery.subtitle}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 md:gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(hasVideo ? i + 1 : i)}
                  aria-label={`Abrir foto ${i + 1} de ${productName}`}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-darkGreen/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange"
                >
                  <img
                    src={src}
                    alt={`${productName} — vista ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </button>
              ))}
            </div>

            {gallery.photographer && (
              <p className="mt-6 text-right font-neue text-[12px] text-neutral-darkGreen">
                Fotógrafo:{' '}
                <strong className="text-neutral-black font-semibold">
                  {gallery.photographer}
                </strong>
              </p>
            )}
          </div>
        </section>
      )}

      <GalleryLightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

export default ProductGallery;
