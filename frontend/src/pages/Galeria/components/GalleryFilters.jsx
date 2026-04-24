import { CATEGORIES, getCategoryCount } from '../galleryData';

const GalleryFilters = ({ active, onChange }) => {
  return (
    <div className="sticky top-[68px] z-30 bg-primary-beige/95 backdrop-blur-sm border-b border-neutral-gray/20">
      <div className="container-custom py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border-2 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary-orange text-white border-primary-orange'
                    : 'bg-white text-neutral-black border-neutral-gray/40 hover:border-primary-orange hover:text-primary-orange'
                }`}
              >
                {cat.label}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-white/80' : 'text-neutral-gray'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GalleryFilters;
