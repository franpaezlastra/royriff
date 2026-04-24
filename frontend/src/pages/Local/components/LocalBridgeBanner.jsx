// Banner naranja full-width con marquee ticker infinito.
// Se duplica el contenido para que el loop se vea continuo.
// La animación está definida en index.css (.rr-marquee-track).

const MARQUEE_ITEM = 'Ya viste el lugar · Ahora probala';

const LocalBridgeBanner = () => {
  // Repetimos el texto varias veces en cada "pista" para asegurar ancho suficiente
  // para hacer el loop sin saltos visibles en monitores anchos.
  const items = Array.from({ length: 8 }, () => MARQUEE_ITEM);

  return (
    <aside
      role="presentation"
      aria-label="Roy Riff te espera"
      className="relative bg-primary-orange text-white overflow-hidden border-y border-black/5"
    >
      {/* Pista de marquee — duplicamos el contenido para que el wrap sea seamless */}
      <div className="rr-marquee-track py-6 md:py-8 whitespace-nowrap">
        {[0, 1].map((track) => (
          <div key={track} className="flex items-center shrink-0">
            {items.map((t, i) => (
              <span key={`${track}-${i}`} className="flex items-center shrink-0">
                <span className="font-barlow font-black uppercase text-2xl md:text-3xl lg:text-4xl tracking-tight px-6 md:px-8">
                  {t}
                </span>
                <span
                  aria-hidden="true"
                  className="font-barlow font-black text-xl md:text-2xl text-white/60"
                >
                  ◆
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LocalBridgeBanner;
