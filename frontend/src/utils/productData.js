/**
 * Datos hardcodeados de productos LOLA y XXXX.
 * Se combinan con los datos de WooCommerce (precio, stock, imágenes, slug real).
 * Las rutas en WordPress pueden ser: slug "lola-cruiser" y "xxxx-expedition".
 */

// Galería del producto en el PDP (sección "Conocé la LOLA / XXXX — Mirala de cerca")
// Fotoshoot Cafayate Abril 2026 — Filmmaker: Nicolás Perondi · Fotógrafo: Sebastian Alcover
// Hay 23 fotos LOLA y 29 fotos XXXX disponibles en assets/products/{lola,xxxx}/.
// El grid del PDP muestra solo las primeras 10 — para cambiar la selección, reordenar el array images[] abajo.
import lolaVideo from '../assets/products/lola/video.mp4';
import lolaVideoPoster from '../assets/products/lola/video-poster.webp';
import lola01 from '../assets/products/lola/01.webp';
import lola02 from '../assets/products/lola/02.webp';
import lola03 from '../assets/products/lola/03.webp';
import lola04 from '../assets/products/lola/04.webp';
import lola05 from '../assets/products/lola/05.webp';
import lola06 from '../assets/products/lola/06.webp';
import lola07 from '../assets/products/lola/07.webp';
import lola08 from '../assets/products/lola/08.webp';
import lola09 from '../assets/products/lola/09.webp';
import lola10 from '../assets/products/lola/10.webp';
import xxxxVideo from '../assets/products/xxxx/video.mp4';
import xxxxVideoPoster from '../assets/products/xxxx/video-poster.webp';
import xxxx01 from '../assets/products/xxxx/01.webp';
import xxxx02 from '../assets/products/xxxx/02.webp';
import xxxx03 from '../assets/products/xxxx/03.webp';
import xxxx04 from '../assets/products/xxxx/04.webp';
import xxxx05 from '../assets/products/xxxx/05.webp';
import xxxx06 from '../assets/products/xxxx/06.webp';
import xxxx07 from '../assets/products/xxxx/07.webp';
import xxxx08 from '../assets/products/xxxx/08.webp';
import xxxx09 from '../assets/products/xxxx/09.webp';
import xxxx10 from '../assets/products/xxxx/10.webp';

// Slugs que usamos para matchear (WooCommerce puede devolver lola-cruiser, lola, etc.)
const LOLA_SLUGS = ['lola-cruiser', 'lola'];
const XXXX_SLUGS = ['xxxx-expedition', 'xxxx'];

const WP_UPLOAD_2026_02 = 'https://api.royriff.com.ar/wp-content/uploads/2026/02';
const WP_UPLOAD_2026_04 = 'https://api.royriff.com.ar/wp-content/uploads/2026/04';

/** Portada (hero derecha); la historia texto|imagen usa `description.storySplit.image`. */
const PRODUCT_DETAIL_IMAGE_OVERRIDES = {
  'lola-cruiser': {
    hero: `${WP_UPLOAD_2026_04}/4.webp`,
    inPage: [],
    byColor: {
      'Champagne Metallic': `${WP_UPLOAD_2026_04}/9.webp`,
      'Graphite Pearl': `${WP_UPLOAD_2026_04}/4.webp`,
    },
  },
  'xxxx-expedition': {
    hero: `${WP_UPLOAD_2026_04}/1-7.webp`,
    inPage: [],
    byColor: {
      'Graphite Pearl': `${WP_UPLOAD_2026_04}/1-7.webp`,
      'Matte Olive Gold': `${WP_UPLOAD_2026_04}/1-2.webp`,
    },
  },
};

/**
 * @returns {{ hero: string, inPage: string[] } | null}
 */
export const getProductDetailImageOverride = (slug) => {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  if (s.includes('lola')) return PRODUCT_DETAIL_IMAGE_OVERRIDES['lola-cruiser'];
  if (s.includes('xxxx')) return PRODUCT_DETAIL_IMAGE_OVERRIDES['xxxx-expedition'];
  return null;
};

export const PRODUCT_DATA = {
  'lola-cruiser': {
    displayName: 'LOLA',
    seoName: 'LOLA | Bicicleta Eléctrica Urbana Cruiser | 500W - Rodado 26"',
    slug: 'lola-cruiser',
    meta: {
      title: 'Roy Riff LOLA: E-Bike Urbana Cruiser 500W | Frenos Hidráulicos y Puerto USB',
      description: 'Descubrí la LOLA. Bicicleta eléctrica urbana estilo Cruiser con autonomía de hasta 65 km, frenos hidráulicos y puerto USB. 100% Legal (Sin patente). Envíos a todo el país.',
    },
    pricing: {
      efectivo: 2000000,
      cuota6: 402000,
      ahorro: 412000,
      cuotas: {
        3: 740000,
        6: 402000,
        9: 295556,
        12: 240000,
      },
    },
    colors: [
      { name: 'Champagne Metallic', value: '#C9B896' },
      { name: 'Graphite Pearl', value: '#4A4A4A' },
    ],
    /**
     * Sección audiovisual del PDP.
     * video: { src, poster, durationSec, credits: { location, period, filmmaker } }.
     *   Si video.src es null, no se renderiza el bloque de video.
     * gallery: { eyebrow, title, subtitle, images, photographer }
     */
    video: {
      src: lolaVideo,
      poster: lolaVideoPoster,
      durationSec: 45,
      credits: {
        location: 'Cafayate',
        period: 'Abril 2026',
        filmmaker: 'Nicolás Perondi',
      },
    },
    gallery: {
      eyebrow: 'CONOCÉ LA LOLA',
      title: 'Mirala de cerca',
      subtitle:
        'Cada detalle pensado para que andes con confianza. Geometría urbana, motor 500W y acabados premium.',
      images: [lola01, lola02, lola03, lola04, lola05, lola06, lola07, lola08, lola09, lola10],
      photographer: 'Sebastian Alcover',
    },
    /**
     * Posición de anclaje de la imagen por color (object-position).
     * Cada foto tiene la bici en distinto lugar dentro del archivo; con esto alineamos todas en el mismo sitio.
     * Valores: "center 50%" = centro; subir el % mueve el ancla hacia abajo; bajar el % hacia arriba.
     */
    imageObjectPositionByColor: {
      'Champagne Metallic': 'center 48%',
      'Graphite Pearl': 'center 58%',
    },
    /** Imágenes por color (clave = nombre del color). Si no hay, se usa la galería general del producto. */
    imagesByColor: {
      'Champagne Metallic': [
        { src: '/images/lola-champagne-1.jpg', alt: 'LOLA Champagne Metallic' },
        { src: '/images/lola-champagne-2.jpg', alt: 'LOLA Champagne Metallic detalle' },
        { src: '/images/lola-champagne-3.jpg', alt: 'LOLA Champagne Metallic lateral' },
      ],
      'Graphite Pearl': [
        { src: '/images/lola-graphite-1.jpg', alt: 'LOLA Graphite Pearl' },
        { src: '/images/lola-graphite-2.jpg', alt: 'LOLA Graphite Pearl detalle' },
        { src: '/images/lola-graphite-3.jpg', alt: 'LOLA Graphite Pearl lateral' },
      ],
    },
    hero: {
      h1: 'LOLA | Bicicleta Eléctrica Urbana Cruiser | 500W - Rodado 26"',
      h2: 'El tráfico decide a qué hora llegás. El precio de la nafta decide cuánto gastás. ¿Quién maneja tu vida?',
      highlights: [
        'Autonomía: 40 - 60 km (Batería 48V 10.4Ah).',
        'Motor: 500W High Torque (Legal EPAC).',
        'Seguridad: Frenos a Disco Hidráulicos delantero y trasero.',
        'Conectividad: Pantalla con Puerto de Carga USB.',
      ],
      productTitle: 'LOLA | Urban Cruiser E-Bike',
    },
    description: {
      storySplit: {
        image: `${WP_UPLOAD_2026_02}/DSC01639-scaled.webp`,
        title: 'La Ciudad es Tuya. Recórrela a Tu Ritmo.',
        paragraphs: [
          'Olvídate del tráfico y llega fresco a tu destino. Imaginate recorriendo las calles de tu ciudad con el viento pegandote en la cara, la sensación de placer bajo el Sol, sin preocupaciones por llegar transpirado, pero moviéndote de una manera sencilla y ecológica. Eso te brinda nuestra bici LOLA.',
          'Olvídate de tener que buscar estacionamiento, de tener que pagar nafta, seguro y patente cada mes. Olvídate de no tener un medio de transporte que te represente y te brinde independencia.',
          'LOLA fusiona la estética clásica de una Cruiser con la potencia eléctrica moderna. Diseñada para aquellos que valoran su independencia y la movilidad sustentable, su cuadro de paso bajo (Step-Through) te permite subir y bajar con facilidad, ideal para la ropa de trabajo o paradas frecuentes.',
        ],
        sectionHeading: '¿Por qué elegir la LOLA?',
        leadCard: {
          titulo: 'Potencia Inteligente y Legal',
          texto:
            'Su motor de 500W te impulsa con un torque de 65 N.m, suficiente para subir pendientes y arrancar rápido en los semáforos, pero limitado a 25 km/h para que circules legalmente por ciclovías sin necesidad de registro, patente ni licencia. En ámbitos privados hasta 34 km/hora, aprovechando todo su poder.',
        },
      },
      bottomBeneficios: [
        {
          titulo: 'Confort Anti-Baches',
          texto:
            'Rodamos sobre neumáticos Chaoyang Semi-Fat de 26" x 3.0". Son más anchos que los de una bici común, lo que sumado a la suspensión delantera con bloqueo, absorbe las imperfecciones de las calles rotas para un andar suave como una nube.',
        },
        {
          titulo: 'Siempre Conectada',
          texto:
            '¿Te quedaste sin batería en el celular usando el GPS? No hay problema. El display LCD de la LOLA incluye un puerto USB integrado para que cargues tus dispositivos mientras pedaleas.',
        },
      ],
    },
    specsTable: [
      { caracteristica: 'Motor', especificacion: '500W Cubo Trasero (Modelo 110SZ) - Torque 65 N.m' },
      { caracteristica: 'Batería', especificacion: '48V 10.4Ah (Extraíble con llave) - Celdas Certificadas' },
      { caracteristica: 'Autonomía Real', especificacion: '40 a 65 km (Dependiendo del nivel de asistencia y terreno)' },
      { caracteristica: 'Velocidad Máx.', especificacion: '25 km/h (Limitada electrónicamente - Legal EPAC)' },
      { caracteristica: 'Tiempo de Carga', especificacion: '5 - 6 Horas (Cargador 2.0A incluido)' },
      { caracteristica: 'Frenos', especificacion: 'Discos Hidráulicos Delantero y Trasero (Modelo HB-875-E)' },
      { caracteristica: 'Neumáticos', especificacion: '26" x 3.0" Chaoyang Semi-Fat (Mayor estabilidad)' },
      { caracteristica: 'Suspensión', especificacion: 'Horquilla delantera con Bloqueo Mecánico (MLO)' },
      { caracteristica: 'Cambios', especificacion: 'Shimano Tourney 7 Velocidades' },
      { caracteristica: 'Display', especificacion: 'LCD Color SW-G518 con Puerto USB' },
      { caracteristica: 'Peso Bici', especificacion: '32 kg' },
      { caracteristica: 'Capacidad de Carga', especificacion: 'Rack trasero soporta hasta 25 kg' },
      { caracteristica: 'Cuadro', especificacion: 'Acero 26" Step-Through (Paso Bajo)' },
    ],
    trustBlock: {
      title: 'TE ACOMPAÑAMOS EN TODO EL PROCESO',
      envios: [
        'Envío a todo el país: Despachamos por paquetería nacional (3 a 6 días hábiles).',
        'Armado: La bicicleta llega pre-ensamblada al 85-90%. Incluye manual y herramientas básicas, pero recomendamos el ajuste final por un bicicletero calificado.',
      ],
      garantia: [
        'Cobertura: 2 años en el cuadro y 1 año en componentes eléctricos (motor, batería, display).',
        'Repuestos: Contamos con stock permanente de baterías, cargadores y pastillas de freno.',
      ],
      servicioTecnico: [
        'Soporte directo vía WhatsApp y mail a postventa@royriff.com.ar para cualquier consulta de mantenimiento.',
      ],
    },
    faq: [
      { pregunta: '¿Necesito registro o licencia para manejar la LOLA?', respuesta: 'No. La LOLA cumple con el Decreto 196/2025 (Motor de 500W y corte a 25 km/h), por lo que legalmente es una bicicleta con pedaleo asistido (EPAC). No requiere patente, seguro obligatorio ni licencia de conducir.' },
      { pregunta: '¿La velocidad máxima es de 25 km/h?', respuesta: 'La LOLA viene configurada de fábrica con un límite electrónico de 25 km/h. Esto garantiza que clasifique legalmente como bicicleta (Normativa EPAC), permitiéndote circular por la vía pública sin necesidad de patente, licencia ni seguro obligatorio. Sin embargo, el motor de 500W tiene potencia de sobra: para uso exclusivo en propiedades privadas o fuera de la vía pública, es posible configurar el límite desde el display digital para liberar su velocidad real de hasta 34 km/h.' },
      { pregunta: '¿Puedo usarla si llueve?', respuesta: 'Sí, los componentes eléctricos tienen protección IP65 (resistentes a salpicaduras y lluvia ligera). Sin embargo, no se recomienda sumergirla ni lavarla con hidrolavadora a presión.' },
      { pregunta: '¿La LOLA cuenta con certificaciones de seguridad internacionales?', respuesta: 'Sí. La batería cuenta con celdas con certificación UN38.3 y MSDS. Las luces delanteras, traseras y los reflectores cumplen con estándares de seguridad de EE.UU. (CPSC), Reino Unido (BS) y Australia (AS).' },
      { pregunta: '¿La batería es extraíble?', respuesta: 'Sí, podés sacar la batería con tu llave de seguridad y cargarla cómodamente en tu casa u oficina, o cargarla directamente puesta en la bici.' },
      { pregunta: '¿Cuánto tiempo tarda en cargarse la batería?', respuesta: 'La batería de la LOLA (48V 10.4Ah) tarda aproximadamente entre 5 y 6 horas en realizar una carga completa (del 0% al 100%). El cargador incluido se conecta a cualquier enchufe estándar de 220V.' },
      { pregunta: '¿Cuál es la vida útil de la batería?', respuesta: 'La batería cuenta con una garantía oficial de 1 año. Utiliza celdas certificadas (normas UN38.3 / MSDS). Se recomienda no dejarla descargada por largos períodos y guardarla en lugares secos y templados.' },
      { pregunta: '¿Qué mantenimiento necesita la bici?', respuesta: 'Similar a una bici convencional: mantener la cadena lubricada, revisar la presión de los neumáticos (indicada en el lateral de la rueda) y chequear el desgaste de las pastillas de freno hidráulico.' },
      { pregunta: '¿Se consiguen repuestos fácilmente?', respuesta: 'Sí. Componentes mecánicos utilizan estándares universales (Shimano Tourney, neumáticos Chaoyang, etc.). Roy Riff cuenta con stock de repuestos originales para elementos específicos (batería, display, etc.).' },
      { pregunta: '¿Qué peso soporta el portaequipajes trasero?', respuesta: 'El rack trasero de acero está diseñado para soportar una carga máxima de 25 kg. Es ideal para llevar una mochila, las compras del día o instalar una silla para niños (respetando el límite de peso).' },
      { pregunta: '¿Qué altura debo tener para usar la LOLA?', respuesta: 'La LOLA tiene un cuadro de acero rodado 26" con diseño Step-Through (Paso Bajo). Recomendada para personas a partir de 1.60 m. El asiento es ajustable en altura.' },
    ],
    links: {
      fichaTecnicaPdf: null, // URL cuando tengas el PDF
      catalogoPdf: null,
    },
  },

  'xxxx-expedition': {
    displayName: 'XXXX',
    seoName: 'Roy Riff XXXX | Bicicleta Eléctrica Todo terreno | 500W - Rodado 20"',
    slug: 'xxxx-expedition',
    meta: {
      title: 'Roy Riff XXXX: E-Bike Fat Tire 500W | 90km de Autonomía y Doble Suspensión',
      description: 'Conocé la XXXX. Bicicleta eléctrica Fat Tire de expedición para arena, tierra y asfalto. Motor 500W, batería de 20Ah (90km), doble suspensión y frenos hidráulicos. 100% Legal (sin patente). Envíos a todo el país.',
    },
    pricing: {
      efectivo: 2700000,
      cuota6: 536167,
      ahorro: 517000,
      cuotas: {
        3: 999000,
        6: 536167,
        9: 399000,
        12: 324000,
      },
    },
    colors: [
      // IMPORTANTE: estos nombres deben coincidir EXACTO con las opciones del atributo "Color"
      // en WooCommerce para que matchee con las variaciones.
      { name: 'Graphite Pearl', value: '#4A4A4A' },
      { name: 'Matte Olive Gold', value: '#8B7355' },
    ],
    /** Sección audiovisual del PDP. Misma estructura que LOLA. */
    video: {
      src: xxxxVideo,
      poster: xxxxVideoPoster,
      durationSec: 45,
      credits: {
        location: 'Cafayate',
        period: 'Abril 2026',
        filmmaker: 'Nicolás Perondi',
      },
    },
    gallery: {
      eyebrow: 'CONOCÉ LA XXXX',
      title: 'Mirala de cerca',
      subtitle:
        'Cada detalle pensado para llevarte más lejos. Fat tire, batería 48V 20Ah y 90 km de autonomía real.',
      images: [xxxx01, xxxx02, xxxx03, xxxx04, xxxx05, xxxx06, xxxx07, xxxx08, xxxx09, xxxx10],
      photographer: 'Sebastian Alcover',
    },
    /** Posición de la imagen por color (mismo criterio que LOLA). Ajustar % si las fotos quedan desalineadas. */
    imageObjectPositionByColor: {
      'Graphite Pearl': 'center 58%',
      'Matte Olive Gold': 'center 55%',
    },
    /** Imágenes por color: vienen de las variaciones de WooCommerce; no se usa fallback local. */
    imagesByColor: {},
    hero: {
      h1: 'Roy Riff XXXX | Bicicleta Eléctrica Todo terreno | 500W - Rodado 20"',
      h2: 'Autonomía Extrema (90 km), Doble Suspensión. Domina cualquier terreno.',
      highlights: [
        'Autonomía Bestial: 70 - 90 km (Batería 48V 20Ah - 960Wh).',
        'Estilo Moto: Asiento largo y Doble Suspensión de Corona.',
        'Todoterreno: Neumáticos Fat Tire 20" x 4.0".',
        'Frenos: Hidráulicos de alto rendimiento.',
      ],
      productTitle: 'XXXX | Tu compañera de aventuras todoterreno',
    },
    description: {
      storySplit: {
        image: `${WP_UPLOAD_2026_02}/DSC01474-scaled.webp`,
        title: 'TU EXPEDICIÓN EMPIEZA DONDE TERMINA EL ASFALTO.',
        paragraphs: [
          'La Roy Riff XXXX no es una bici común. Es una declaración de principios. Diseñada para quienes creen que el mundo necesita más locos que se animen a explorar, esta máquina ignora los pozos, conquista la arena y domina la ciudad con una presencia que intimida.',
        ],
        sectionHeading: '¿Por qué la XXXX juega en otra liga?',
        leadCard: {
          titulo: 'El Fin de la "Ansiedad de Rango"',
          texto:
            'Mientras otras e-bikes te dejan a mitad de camino con baterías de 10Ah, la XXXX monta una celda de 20Ah (960 Wh). Es el doble de energía. Salí a trabajar, repartir o explorar todo el día sin mirar el indicador de batería.',
        },
      },
      bottomBeneficios: [
        {
          titulo: 'Suspensión Grado Moto',
          texto:
            'Olvídate de las vibraciones. Equipada con una horquilla delantera de Doble Corona de Acero (tipo downhill) y un shock trasero HLT-100. Es una alfombra mágica sobre adoquines, tierra o pozos.',
        },
        {
          titulo: 'Estilo Rebelde, Corazón Legal',
          texto:
            'Parece una moto, se siente como una moto, pero es legalmente una bicicleta (EPAC). Gracias a su motor de 500W limitado a 25 km/h, circulás libremente sin patente, sin registro y sin seguro obligatorio.',
        },
        {
          titulo: 'Centro de Comando 4.0"',
          texto:
            'Controlá tu nave desde el display gigante SW-M808X. Pantalla color, resistente al agua (IP65) y preparada para el futuro (NFC/Bluetooth opcional).',
        },
      ],
    },
    specsTable: [
      { caracteristica: 'Motor', especificacion: '500W Cubo Trasero (Modelo JB110C) - 48V' },
      { caracteristica: 'Batería', especificacion: '48V 20Ah (960 Wh) - Litio Alta Densidad' },
      { caracteristica: 'Autonomía Real', especificacion: '70 a 90 km (Asistido nivel 1-2)' },
      { caracteristica: 'Cargador', especificacion: '54.6V 3.0A (Carga Rápida - Estándar Europeo)' },
      { caracteristica: 'Velocidad Máx.', especificacion: '25 km/h (Corte electrónico por Ley EPAC)' },
      { caracteristica: 'Frenos', especificacion: 'Discos Hidráulicos (Modelo HD-E3520 F/R)' },
      { caracteristica: 'Suspensión Delantera', especificacion: 'Doble Corona de Acero (190S-DH-20)' },
      { caracteristica: 'Suspensión Trasera', especificacion: 'Amortiguador HLT-100 (1200 lbs)' },
      { caracteristica: 'Neumáticos', especificacion: '20" x 4.0" Chaoyang Anti-Pinchazos (30TPI)' },
      { caracteristica: 'Cambios', especificacion: 'Shimano Tourney 7 Velocidades (TX50)' },
      { caracteristica: 'Display', especificacion: 'SW-M808X (LCD Color 4.0" - IP65)' },
      { caracteristica: 'Peso Bici', especificacion: '42 kg (Estructura Heavy Duty)' },
      { caracteristica: 'Cuadro', especificacion: 'Aleación de Aluminio 20" Reforzado' },
      { caracteristica: 'Asiento', especificacion: 'Estilo Moto (Long Saddle) - Negro' },
    ],
    trustBlock: {
      title: 'TE ACOMPAÑAMOS EN TODO EL PROCESO',
      items: [
        'Garantía Oficial: 24 meses (2 años) por defectos de fabricación.',
        'Envío Seguro: Despachamos a todo el país. La bici viaja protegida y pre-ensamblada al 85%.',
        'Certificaciones: Batería con norma UN38.3 (Anti-explosión) y Componentes IP65 (Resistentes a Lluvia).',
        'Botón de Arrepentimiento: Comprá tranquilo. Tenés 10 días para devolverla si no es lo que esperabas (Ley 24.240).',
        'Repuestos: Stock permanente de baterías, cargadores y pastillas de freno originales Roy Riff.',
      ],
    },
    faq: [
      { pregunta: '¿Necesito registro, patente o seguro? (Tiene cara de moto)', respuesta: 'No. Aunque la XXXX tiene estética de moto y un chasis robusto, legalmente es una Bicicleta con Pedaleo Asistido (EPAC). Su motor es de 500W y la asistencia corta a 25 km/h, cumpliendo con el Decreto 196/2025. Sos libre de burocracia.' },
      { pregunta: '¿Es verdad que hace 90 km con una carga?', respuesta: 'Sí, es su mayor ventaja. Gracias a la batería de 20Ah (el doble que una bici normal), podés lograr entre 70 y 90 km utilizando el Pedaleo Asistido (PAS) en niveles eficientes. Si usás solo el acelerador (modo moto), la autonomía será menor, pero seguirás teniendo el rango más alto de la categoría.' },
      { pregunta: '¿Cuánto tarda en cargar esa batería gigante?', respuesta: 'Menos de lo que pensás. La XXXX incluye un Cargador Rápido de 3.0A de serie. Una carga completa (0 al 100%) toma entre 6 y 7 horas. Podés sacar la batería con la llave y cargarla en tu casa u oficina.' },
      { pregunta: '¿Puedo llevar un acompañante en el asiento largo?', respuesta: 'El asiento Long Saddle es súper cómodo y permite varias posiciones de manejo. El cuadro soporta mucha carga, pero por manual de seguridad se recomienda un solo conductor. Llevar pasajero queda bajo tu responsabilidad y reducirá la autonomía y maniobrabilidad.' },
      { pregunta: '¿Qué pasa si llueve?', respuesta: 'La XXXX se banca la calle real. El display SW-M808X y los conectores tienen certificación IP65 (herméticos al polvo y chorros de agua). Podés andar bajo lluvia ligera sin drama. No la laves con hidrolavadora a presión directa.' },
    ],
    links: {
      fichaTecnicaPdf: null,
      catalogoPdf: null,
    },
  },
};

/**
 * Buscar datos hardcodeados por slug o nombre del producto de WooCommerce
 */
export const findHardcodedData = (product) => {
  if (!product) return null;
  const slug = (product.slug || '').toLowerCase().trim();
  const name = (product.name || '').toUpperCase();

  if (LOLA_SLUGS.some(s => slug === s || slug.includes('lola'))) {
    return PRODUCT_DATA['lola-cruiser'];
  }
  if (XXXX_SLUGS.some(s => slug === s || slug.includes('xxxx')) || slug.includes('expedition')) {
    return PRODUCT_DATA['xxxx-expedition'];
  }
  if (name.includes('LOLA')) return PRODUCT_DATA['lola-cruiser'];
  if (name.includes('XXXX')) return PRODUCT_DATA['xxxx-expedition'];

  return null;
};

/**
 * Combina producto de WooCommerce con datos hardcodeados.
 * API manda: id, slug, name, price, stock, images.
 * Hardcodeado: meta, colors, hero, description, specsTable, trustBlock, faq.
 */
export const enrichProductData = (wcProduct) => {
  if (!wcProduct) return null;
  const hardcoded = findHardcodedData(wcProduct);

  if (!hardcoded) {
    return {
      ...wcProduct,
      displayName: wcProduct.name?.split('|')[0]?.trim() || wcProduct.name || '',
    };
  }

  // Imágenes por color: SOLO desde API (Variaciones).
  // No usar fallback a productData ni a product.images porque el usuario quiere ver únicamente la imagen asignada en Variaciones.
  const imagesByColor = wcProduct.imagesByColor && Object.keys(wcProduct.imagesByColor).length > 0
    ? wcProduct.imagesByColor
    : null;

  return {
    ...wcProduct,
    displayName: hardcoded.displayName || wcProduct.name?.split('|')[0]?.trim() || wcProduct.name,
    seoName: hardcoded.seoName || wcProduct.name,
    meta: hardcoded.meta,
    colors: hardcoded.colors,
    imagesByColor,
    variationByColor: wcProduct.variationByColor || null,
    imageObjectPositionByColor: hardcoded.imageObjectPositionByColor || null,
    hero: hardcoded.hero,
    description: hardcoded.description,
    specsTable: hardcoded.specsTable,
    trustBlock: hardcoded.trustBlock,
    faq: hardcoded.faq,
    links: hardcoded.links,
    pricing: hardcoded.pricing,
    video: hardcoded.video,
    gallery: hardcoded.gallery,
    tagline: hardcoded.hero?.productTitle || hardcoded.hero?.h2,
  };
};

export const getDisplayName = (product) => {
  if (!product) return '';
  if (product.displayName) return product.displayName;
  if (product.name?.includes('|')) return product.name.split('|')[0].trim();
  return product.name || '';
};

export default PRODUCT_DATA;
