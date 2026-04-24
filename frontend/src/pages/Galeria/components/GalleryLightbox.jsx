import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const GalleryLightbox = ({ items, currentIndex, onClose, onNext, onPrev }) => {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const item = isOpen ? items[currentIndex] : null;

  // Keyboard handler: Esc cierra, ← → navegan
  const handleKey = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKey);
    // Bloquear scroll del body mientras está abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
      >
        {/* Cerrar */}
        <button
          type="button"
          aria-label="Cerrar galería"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Prev / Next */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-7 h-7" />
            </button>
          </>
        )}

        {/* Contador */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest uppercase">
          {currentIndex + 1} / {items.length}
        </div>

        {/* Contenido */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-[92vw] max-h-[85vh] flex items-center justify-center"
        >
          {item.type === 'video' ? (
            <video
              src={item.src}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[85vh] object-contain"
            >
              Tu navegador no soporta video embebido.
            </video>
          ) : (
            <img
              src={item.src}
              alt={item.title}
              className="max-w-full max-h-[85vh] object-contain"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryLightbox;
