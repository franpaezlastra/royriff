// Gallery data — array de piezas con metadata
// Para agregar nuevos items: drop la foto en src/assets/galeria/<categoria>/ y
// agregá una entrada al array GALLERY_ITEMS con su import correspondiente.

// Productos
import lola01 from '../../assets/galeria/productos/lola-01.webp';
import lola02 from '../../assets/galeria/productos/lola-02.webp';
import lola03 from '../../assets/galeria/productos/lola-03.webp';
import lola04 from '../../assets/galeria/productos/lola-04.webp';
import lola05 from '../../assets/galeria/productos/lola-05.webp';
import xxxx01 from '../../assets/galeria/productos/xxxx-01.webp';
import xxxx02 from '../../assets/galeria/productos/xxxx-02.webp';
import xxxx03 from '../../assets/galeria/productos/xxxx-03.webp';
import xxxx04 from '../../assets/galeria/productos/xxxx-04.webp';
import xxxx05 from '../../assets/galeria/productos/xxxx-05.webp';

// Clientes (reusando las fotos ya procesadas de testimonios — muestran al cliente con su bici)
import hectorImg from '../../assets/testimonios/hector-gramajo.webp';
import agustinImg from '../../assets/testimonios/agustin-fernandez.webp';
import arielImg from '../../assets/testimonios/ariel-martinez.webp';
import federicoImg from '../../assets/testimonios/federico-jairala.webp';
import matiasImg from '../../assets/testimonios/matias-salazar.webp';
import patriciaImg from '../../assets/testimonios/patricia-cigale.webp';

export const CATEGORIES = [
  { id: 'todo', label: 'Todo' },
  { id: 'productos', label: 'Productos' },
  { id: 'vida', label: 'Vida Roy Riff' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'videos', label: 'Videos' },
];

export const GALLERY_ITEMS = [
  // ─── PRODUCTOS ───
  {
    id: 'prod-lola-01',
    type: 'image',
    src: lola01,
    category: 'productos',
    title: 'LOLA Urban Cruiser',
    caption: 'Paseo urbano, rodado 26"',
  },
  {
    id: 'prod-lola-02',
    type: 'image',
    src: lola02,
    category: 'productos',
    title: 'LOLA — detalle',
    caption: 'Líneas limpias, confort cruiser',
  },
  {
    id: 'prod-lola-03',
    type: 'image',
    src: lola03,
    category: 'productos',
    title: 'LOLA Champagne Metallic',
    caption: 'Color tierra, accesorios dorados',
  },
  {
    id: 'prod-lola-04',
    type: 'image',
    src: lola04,
    category: 'productos',
    title: 'LOLA en movimiento',
    caption: 'Frenos hidráulicos y puerto USB',
  },
  {
    id: 'prod-lola-05',
    type: 'image',
    src: lola05,
    category: 'productos',
    title: 'LOLA Graphite Pearl',
    caption: 'Versión oscura, acabado mate',
  },
  {
    id: 'prod-xxxx-01',
    type: 'image',
    src: xxxx01,
    category: 'productos',
    title: 'XXXX Expedición',
    caption: 'Fat tire todoterreno',
  },
  {
    id: 'prod-xxxx-02',
    type: 'image',
    src: xxxx02,
    category: 'productos',
    title: 'XXXX en acción',
    caption: 'Suspensión doble + motor 500W',
  },
  {
    id: 'prod-xxxx-03',
    type: 'image',
    src: xxxx03,
    category: 'productos',
    title: 'XXXX — perfil',
    caption: 'Batería extraíble 20Ah',
  },
  {
    id: 'prod-xxxx-04',
    type: 'image',
    src: xxxx04,
    category: 'productos',
    title: 'XXXX — detalle mecánico',
    caption: 'Rodado 20" con cubierta fat',
  },
  {
    id: 'prod-xxxx-05',
    type: 'image',
    src: xxxx05,
    category: 'productos',
    title: 'XXXX Expedición',
    caption: 'Pensada para rutas y montaña',
  },

  // ─── CLIENTES ───
  {
    id: 'cli-hector',
    type: 'image',
    src: hectorImg,
    category: 'clientes',
    title: 'Héctor Gramajo',
    caption: 'Tucumán · LOLA ×2',
  },
  {
    id: 'cli-agustin',
    type: 'image',
    src: agustinImg,
    category: 'clientes',
    title: 'Agustín Fernández',
    caption: 'Tucumán · XXXX',
  },
  {
    id: 'cli-ariel',
    type: 'image',
    src: arielImg,
    category: 'clientes',
    title: 'Ariel Martínez',
    caption: 'Tucumán · LOLA',
  },
  {
    id: 'cli-federico',
    type: 'image',
    src: federicoImg,
    category: 'clientes',
    title: 'Federico Jairala',
    caption: 'Tucumán · LOLA',
  },
  {
    id: 'cli-matias',
    type: 'image',
    src: matiasImg,
    category: 'clientes',
    title: 'Matías Salazar',
    caption: 'Tucumán · XXXX',
  },
  {
    id: 'cli-patricia',
    type: 'image',
    src: patriciaImg,
    category: 'clientes',
    title: 'Patricia Cigale',
    caption: 'Tucumán · LOLA',
  },

  // ─── VIDA ROY RIFF, EVENTOS, VIDEOS ───
  // (Pendientes — se agregan aquí cuando el dueño suba el contenido)
];

// Devuelve el hero featured de la galería (primer item con flag `featured` o el primero de la lista)
export const getFeaturedItem = () => {
  const featured = GALLERY_ITEMS.find((i) => i.featured);
  return featured || GALLERY_ITEMS[0];
};

// Cuenta items por categoría para mostrar en los filtros
export const getCategoryCount = (categoryId) => {
  if (categoryId === 'todo') return GALLERY_ITEMS.length;
  return GALLERY_ITEMS.filter((i) => i.category === categoryId).length;
};
