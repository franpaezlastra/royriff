/**
 * Bloque informativo: retiro en sucursal del correo (Andreani, etc.).
 * El título de la tarifa WC suele traer nombre + dirección de la sucursal.
 */
export const ANDREANI_SUCURSALES_URL = 'https://www.andreani.com/#!/InformacionSucursales';

export default function BranchSucursalInfo({
  title,
  className = '',
  compact = false,
}) {
  if (!title?.trim()) return null;
  return (
    <div
      className={`rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 to-white px-4 py-3 space-y-2 ${className}`}
    >
      <p className="text-[10px] font-semibold text-blue-900/90 uppercase tracking-wider font-neue">
        {compact ? 'Tu sucursal' : 'Dónde retirás el pedido'}
      </p>
      <p className="text-sm font-neue text-neutral-darkGreen leading-relaxed whitespace-pre-wrap break-words">
        {title.trim()}
      </p>
      <p className="text-[11px] text-neutral-darkGreen/60 font-neue leading-snug">
        Esa información viene del método de envío que calculó WooCommerce. Si solo ves «punto de retiro» sin
        dirección, elegí la sucursal en el mapa de Andreani o consultanos.
      </p>
      <a
        href={ANDREANI_SUCURSALES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-xs font-semibold text-blue-700 hover:text-blue-900 font-neue underline underline-offset-2"
      >
        Ver sucursales Andreani (mapa)
      </a>
    </div>
  );
}
