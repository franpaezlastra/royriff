import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaSpotify, FaWhatsapp } from 'react-icons/fa';
import { FiImage } from 'react-icons/fi';
import { CONTACT_INFO } from '../../utils/constants';
import SectionTitle from '../../components/common/SectionTitle';
import { GALLERY_ITEMS, getFeaturedItem } from './galleryData';
import GalleryFilters from './components/GalleryFilters';
import GalleryTile from './components/GalleryTile';
import GalleryLightbox from './components/GalleryLightbox';

const INSTAGRAM_URL = 'https://www.instagram.com/royriff.arg/';
const SPOTIFY_PLAYLIST_URL =
  'https://open.spotify.com/playlist/0AKlsyoyQtdk2X6FSARVb0?si=QRmGgdetSTGFAh_flsd3yA&pi=10F8RErnSRCD0';

const Galeria = () => {
  const [activeCategory, setActiveCategory] = useState('todo');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const featured = getFeaturedItem();

  const filteredItems = useMemo(() => {
    if (activeCategory === 'todo') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    document.title = 'Galería Roy Riff · Fotos y videos de bicis eléctricas';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Explorá la galería visual de Roy Riff: LOLA, XXXX, clientes reales y la vida de marca. Fotos y videos oficiales.'
      );
    }
  }, []);

  const openLightbox = (item) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => setLightboxIndex(null);
  const nextItem = () =>
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
  const prevItem = () =>
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
    );

  const hasContent = filteredItems.length > 0;

  return (
    <div className="bg-primary-beige">
      {/* HERO — mismo patrón que HeroSection home */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: featured && featured.type === 'image' ? `url(${featured.src})` : undefined,
            backgroundColor: '#151515',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="font-barlow font-black text-4xl md:text-6xl lg:text-7xl !text-white mb-4 leading-tight uppercase">
              Galería Roy Riff
            </h1>
            <h2 className="font-barlow font-black text-3xl md:text-5xl lg:text-6xl !text-white mb-8 leading-tight uppercase">
              La marca en movimiento
            </h2>
            <p className="font-neue !text-white text-lg md:text-xl mb-2 font-normal">
              Fotos y videos de productos, clientes y la vida Roy Riff.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTROS */}
      <GalleryFilters active={activeCategory} onChange={setActiveCategory} />

      {/* GRID MASONRY */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          {hasContent ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {filteredItems.map((item, idx) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  index={idx}
                  onClick={openLightbox}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-10 md:p-14 text-center max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-primary-orange/10 flex items-center justify-center mx-auto mb-5">
                <FiImage className="w-7 h-7 text-primary-orange" />
              </div>
              <h3 className="font-barlow font-black text-2xl text-neutral-black uppercase mb-3">
                Estamos preparando este material
              </h3>
              <p className="font-neue text-neutral-darkGreen text-sm leading-relaxed">
                Muy pronto vas a ver fotos y videos nuevos acá. Mientras tanto,
                explorá otras categorías desde los filtros de arriba.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL — Seguinos */}
      <section className="bg-neutral-black py-14 md:py-20">
        <div className="container-custom text-center max-w-2xl">
          <SectionTitle
            title="Seguinos"
            subtitle="Contenido nuevo cada semana. La comunidad Roy Riff también vive en redes."
            variant="dark"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-7 rounded-full bg-primary-orange text-white hover:bg-[#E03D0B] transition-smooth"
            >
              <FaInstagram className="w-5 h-5" />
              Instagram
            </a>
            <a
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-neutral-black transition-smooth"
            >
              <FaSpotify className="w-5 h-5" />
              Playlist
            </a>
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-7 rounded-full border-2 border-white text-white hover:bg-white hover:text-neutral-black transition-smooth"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextItem}
        onPrev={prevItem}
      />
    </div>
  );
};

export default Galeria;
