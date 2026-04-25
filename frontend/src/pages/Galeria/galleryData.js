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

// Eventos — Inauguración del local (curado de 18 fotos de la sesión)
import inaug01 from '../../assets/galeria/eventos/inaug-01.webp';
import inaug02 from '../../assets/galeria/eventos/inaug-02.webp';
import inaug03 from '../../assets/galeria/eventos/inaug-03.webp';
import inaug04 from '../../assets/galeria/eventos/inaug-04.webp';
import inaug05 from '../../assets/galeria/eventos/inaug-05.webp';
import inaug06 from '../../assets/galeria/eventos/inaug-06.webp';
import inaug07 from '../../assets/galeria/eventos/inaug-07.webp';
import inaug08 from '../../assets/galeria/eventos/inaug-08.webp';
import inaug09 from '../../assets/galeria/eventos/inaug-09.webp';
import inaug10 from '../../assets/galeria/eventos/inaug-10.webp';
import inaug11 from '../../assets/galeria/eventos/inaug-11.webp';
import inaug12 from '../../assets/galeria/eventos/inaug-12.webp';
import inaug13 from '../../assets/galeria/eventos/inaug-13.webp';
import inaug14 from '../../assets/galeria/eventos/inaug-14.webp';
import inaug15 from '../../assets/galeria/eventos/inaug-15.webp';
import inaug16 from '../../assets/galeria/eventos/inaug-16.webp';
import inaug17 from '../../assets/galeria/eventos/inaug-17.webp';
import inaug18 from '../../assets/galeria/eventos/inaug-18.webp';

// Vida Roy Riff — producciones Noviembre 2026 (Verde Yerba Buena)
import nov01 from '../../assets/galeria/vida/nov-01.webp';
import nov02 from '../../assets/galeria/vida/nov-02.webp';
import nov03 from '../../assets/galeria/vida/nov-03.webp';
import nov04 from '../../assets/galeria/vida/nov-04.webp';
import nov05 from '../../assets/galeria/vida/nov-05.webp';
import nov06 from '../../assets/galeria/vida/nov-06.webp';
import nov07 from '../../assets/galeria/vida/nov-07.webp';
import nov08 from '../../assets/galeria/vida/nov-08.webp';
import nov09 from '../../assets/galeria/vida/nov-09.webp';
import nov10 from '../../assets/galeria/vida/nov-10.webp';
import nov11 from '../../assets/galeria/vida/nov-11.webp';
import nov12 from '../../assets/galeria/vida/nov-12.webp';
import nov13 from '../../assets/galeria/vida/nov-13.webp';
import nov14 from '../../assets/galeria/vida/nov-14.webp';

// Vida Roy Riff — producciones Febrero 2026 (centro)
import feb01 from '../../assets/galeria/vida/feb-01.webp';
import feb02 from '../../assets/galeria/vida/feb-02.webp';
import feb03 from '../../assets/galeria/vida/feb-03.webp';
import feb04 from '../../assets/galeria/vida/feb-04.webp';
import feb05 from '../../assets/galeria/vida/feb-05.webp';
import feb06 from '../../assets/galeria/vida/feb-06.webp';
import feb07 from '../../assets/galeria/vida/feb-07.webp';
import feb08 from '../../assets/galeria/vida/feb-08.webp';
import feb09 from '../../assets/galeria/vida/feb-09.webp';
import feb10 from '../../assets/galeria/vida/feb-10.webp';
import feb11 from '../../assets/galeria/vida/feb-11.webp';
import feb12 from '../../assets/galeria/vida/feb-12.webp';

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

  // ─── EVENTOS — Inauguración del local ───
  { id: 'evt-inaug-01', type: 'image', src: inaug01, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-02', type: 'image', src: inaug02, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-03', type: 'image', src: inaug03, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-04', type: 'image', src: inaug04, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-05', type: 'image', src: inaug05, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-06', type: 'image', src: inaug06, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-07', type: 'image', src: inaug07, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-08', type: 'image', src: inaug08, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-09', type: 'image', src: inaug09, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-10', type: 'image', src: inaug10, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-11', type: 'image', src: inaug11, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-12', type: 'image', src: inaug12, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-13', type: 'image', src: inaug13, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-14', type: 'image', src: inaug14, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-15', type: 'image', src: inaug15, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-16', type: 'image', src: inaug16, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-17', type: 'image', src: inaug17, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },
  { id: 'evt-inaug-18', type: 'image', src: inaug18, category: 'eventos', title: 'Inauguración del local', caption: 'Apertura · Yerba Buena' },

  // ─── VIDA ROY RIFF — producciones Noviembre 2026 (Verde Yerba Buena) ───
  { id: 'vida-nov-01', type: 'image', src: nov01, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-02', type: 'image', src: nov02, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-03', type: 'image', src: nov03, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-04', type: 'image', src: nov04, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-05', type: 'image', src: nov05, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-06', type: 'image', src: nov06, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-07', type: 'image', src: nov07, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-08', type: 'image', src: nov08, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-09', type: 'image', src: nov09, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-10', type: 'image', src: nov10, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-11', type: 'image', src: nov11, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-12', type: 'image', src: nov12, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-13', type: 'image', src: nov13, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },
  { id: 'vida-nov-14', type: 'image', src: nov14, category: 'vida', title: 'Verde Yerba Buena', caption: 'Producción · Noviembre 2026' },

  // ─── VIDA ROY RIFF — producciones Febrero 2026 (centro) ───
  { id: 'vida-feb-01', type: 'image', src: feb01, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-02', type: 'image', src: feb02, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-03', type: 'image', src: feb03, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-04', type: 'image', src: feb04, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-05', type: 'image', src: feb05, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-06', type: 'image', src: feb06, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-07', type: 'image', src: feb07, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-08', type: 'image', src: feb08, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-09', type: 'image', src: feb09, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-10', type: 'image', src: feb10, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-11', type: 'image', src: feb11, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
  { id: 'vida-feb-12', type: 'image', src: feb12, category: 'vida', title: 'Roy Riff por la ciudad', caption: 'Producción · Febrero 2026' },
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
