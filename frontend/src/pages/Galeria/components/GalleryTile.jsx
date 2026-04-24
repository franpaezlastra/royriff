import { FiPlay } from 'react-icons/fi';

const CATEGORY_LABELS = {
  productos: 'Productos',
  vida: 'Vida Roy Riff',
  clientes: 'Clientes',
  eventos: 'Eventos',
  videos: 'Videos',
};

const GalleryTile = ({ item, index, onClick, showIndex = false }) => {
  const isVideo = item.type === 'video';
  const hasCategory = Boolean(item.category);
  const hasTitle = Boolean(item.title);
  const showHoverMetadata = hasCategory || hasTitle || item.caption;

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative block w-full mb-4 break-inside-avoid overflow-hidden rounded-md bg-neutral-black/5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
      aria-label={item.title ? `Abrir ${item.title}` : `Abrir imagen ${index + 1}`}
    >
      <img
        src={item.thumbnail || item.src}
        alt={item.title || `Local Roy Riff — imagen ${index + 1}`}
        loading={index < 6 ? 'eager' : 'lazy'}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* Editorial index number — esquina superior izquierda */}
      {showIndex && (
        <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 font-barlow font-black text-white/75 text-[10px] tracking-[0.2em] mix-blend-difference">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      {/* Play icon para videos (siempre visible) */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
            <FiPlay className="w-6 h-6 text-neutral-black ml-1" />
          </div>
        </div>
      )}

      {/* Overlay gradient + metadata en hover */}
      {showHoverMetadata && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
            {hasCategory && (
              <span className="inline-block bg-primary-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
            )}
            {hasTitle && (
              <p className="font-barlow font-black text-white text-base md:text-lg uppercase leading-tight">
                {item.title}
              </p>
            )}
            {item.caption && (
              <p className="font-neue text-white/80 text-xs mt-0.5">
                {item.caption}
              </p>
            )}
          </div>
        </>
      )}
    </button>
  );
};

export default GalleryTile;
