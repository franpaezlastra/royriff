// Información de contacto
export const CONTACT_INFO = {
  whatsapp: '+54 381 200-6514',
  whatsappLink: 'https://wa.me/5493812006514',
  email: 'postventa@royriff.com.ar',
  address: 'Avenida Aconquija 1727, Yerba Buena, Tucumán',
  /** Enlace corto oficial al pin en Google Maps */
  googleMapsLink: 'https://maps.app.goo.gl/2HgLACgZTQbXrW856',
  /** iframe embed (misma ubicación que la dirección) */
  googleMapsEmbedSrc: `https://maps.google.com/maps?q=${encodeURIComponent(
    'Avenida Aconquija 1727, Yerba Buena, Tucumán, Argentina'
  )}&hl=es&z=16&output=embed`,
};

// Información de productos
export const PRODUCTS = {
  LOLA: {
    id: 'lola',
    name: 'LOLA',
    fullName: 'LOLA Urban Cruiser',
    // Usar siempre el slug real de WooCommerce
    slug: 'lola-cruiser',
    tagline: 'La cruiser para moverte por la ciudad sin transpirar',
    price: 3300000,
    installments: 12,
    installmentPrice: 275000,
    discount: {
      method: 'Transferencia bancaria',
      percentage: 30,
      description: 'Hasta 30% OFF',
    },
    specs: {
      motor: '500W Cubo Trasero (Modelo 110SZ) - Torque 65 N.m',
      battery: '48V 10.4Ah (Extraíble con llave) - Celdas Certificadas',
      autonomy: '40 a 65 km',
      autonomyRange: { min: 40, max: 65 },
      speed: '25 km/h (Limitada electrónicamente - Legal EPAC)',
      speedPrivate: '34 km/h (Ámbitos privados)',
      chargeTime: '5 - 6 Horas (Cargador 2.0A incluido)',
      brakes: 'Discos Hidráulicos Delantero y Trasero (Modelo HB-875-E)',
      tires: '26" x 3.0" Chaoyang Semi-Fat',
      suspension: 'Horquilla delantera con Bloqueo Mecánico (MLO)',
      gears: 'Shimano Tourney 7 Velocidades',
      display: 'LCD Color SW-G518 con Puerto USB',
      weight: 32,
      maxLoad: 25,
      frame: 'Acero 26" Step-Through (Paso Bajo)',
    },
    features: [
      'Autonomía: 40 - 60 km (Batería 48V 10.4Ah)',
      'Motor: 500W High Torque (Legal EPAC)',
      'Seguridad: Frenos a Disco Hidráulicos delantero y trasero',
      'Conectividad: Pantalla con Puerto de Carga USB',
    ],
    useCase: 'Ciudad, ciclovías, asfalto, comodidad',
    images: {
      main: '/images/lola-main.jpg',
      gallery: [
        '/images/lola-1.jpg',
        '/images/lola-2.jpg',
        '/images/lola-3.jpg',
        '/images/lola-4.jpg',
      ],
    },
  },
  XXXX: {
    id: 'xxxx',
    name: 'XXXX',
    fullName: 'XXXX Expedición Todoterreno',
    // Slug real de WooCommerce para XXXX
    slug: 'xxxx-expedition',
    tagline: 'Tu compañera de aventuras todoterreno',
    price: 4400000,
    installments: 12,
    installmentPrice: 366667,
    discount: {
      method: 'Transferencia bancaria',
      amount: 2700000,
      percentage: 39,
      description: '39% OFF',
    },
    specs: {
      motor: '500W Cubo Trasero - Torque 65 N.m',
      battery: '48V 20Ah (960Wh) - Celdas Certificadas',
      autonomy: '70 a 90 km',
      autonomyRange: { min: 70, max: 90 },
      speed: '25 km/h (Limitada electrónicamente - Legal EPAC)',
      speedPrivate: '34 km/h (Ámbitos privados)',
      chargeTime: '7 - 8 Horas (Cargador Rápido 3.0A incluido)',
      brakes: 'Discos Hidráulicos de Alto Rendimiento',
      tires: '20" x 4.0" Chaoyang Fat Tire Anti-Pinchazos',
      suspension: 'Doble Suspensión (Horquilla Doble Corona + Amortiguador Trasero HLT-100)',
      gears: 'Shimano Tourney 7 Velocidades',
      display: 'LCD SW-M808X (4.0" Gran Formato)',
      weight: 42,
      maxLoad: 25,
      frame: 'Aleación de Aluminio 20" Reforzado',
    },
    features: [
      'Autonomía Bestial: 70 - 90 km (Batería 48V 20Ah - 960Wh)',
      'Estilo Moto: Asiento largo y Doble Suspensión de Corona',
      'Todoterreno: Neumáticos Fat Tire 20" x 4.0"',
      'Frenos: Hidráulicos de alto rendimiento',
    ],
    useCase: 'Expedición, distancia + estabilidad + terreno mixto',
    images: {
      main: '/images/xxxx-main.jpg',
      gallery: [
        '/images/xxxx-1.jpg',
        '/images/xxxx-2.jpg',
        '/images/xxxx-3.jpg',
        '/images/xxxx-4.jpg',
      ],
    },
  },
};

// Información de garantía
export const WARRANTY_INFO = {
  electric: {
    duration: '1 año',
    covers: ['Motor', 'Batería', 'Controller', 'Display'],
    type: 'Fallas de fábrica',
  },
  frame: {
    duration: '2 años',
    covers: ['Cuadro'],
  },
  exclusions: [
    'Golpes o daños por mal uso',
    'Exposición excesiva al agua',
    'Desgaste normal de componentes',
  ],
};

// Información de envíos
export const SHIPPING_INFO = {
  coverage: 'Todo el país',
  deliveryTime: '3 a 6 días hábiles',
  assemblyLevel: '85-90%',
  includes: ['Manual de armado', 'Herramientas básicas', 'Videos tutoriales'],
  recommendation: 'Ajuste final por bicicletero calificado',
};

// Métodos de pago
export const PAYMENT_METHODS = {
  mercadoPago: {
    name: 'Mercado Pago',
    installments: 12,
    description: 'Todos los medios habilitados. CFT aplicable según medio de pago y entidad emisora.',
  },
  cards: {
    name: 'Tarjetas de crédito/débito',
    description: 'Vía Mercado Pago',
  },
  transfer: {
    name: 'Transferencia bancaria',
    description: 'Si lo habilitás en WooCommerce aparte de este flujo',
  },
};

// Utilidades de formato
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-AR').format(num);
};

/**
 * Normalizar URL de imagen de WooCommerce para que funcione en local y producción
 * Las imágenes de WooCommerce pueden venir como URLs absolutas o relativas
 * 
 * En producción: WooCommerce devuelve URLs absolutas como https://api.royriff.com.ar/wp-content/uploads/...
 * En local: Puede que necesitemos usar la URL de producción o construirla relativa
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Si ya es una URL completa (http/https), usarla tal cual
  // Esto funciona tanto en local como en producción
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Si es una ruta relativa que empieza con /wp-content/, construir URL completa
  // usando el dominio actual (funciona en producción) o el de producción si estamos en local
  if (imageUrl.startsWith('/wp-content/')) {
    // En desarrollo local, intentar usar la URL de producción si está disponible
    const productionUrl = import.meta.env.VITE_STORE_URL || import.meta.env.VITE_WOOCOMMERCE_URL || 'https://api.royriff.com.ar';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocal && productionUrl) {
      return productionUrl + imageUrl;
    }
    
    return window.location.origin + imageUrl;
  }
  
  // Si es una ruta relativa que empieza con /, construir URL completa
  if (imageUrl.startsWith('/')) {
    return window.location.origin + imageUrl;
  }
  
  // Si es una ruta relativa sin /, agregar /
  return window.location.origin + '/' + imageUrl;
};

/**
 * Obtener la imagen principal de un producto
 * Maneja diferentes formatos de datos de imágenes de WooCommerce
 */
export const getProductMainImage = (product) => {
  if (!product) return null;
  
  // Si tiene propiedad 'image' directa
  if (product.image) {
    return typeof product.image === 'string' 
      ? normalizeImageUrl(product.image) 
      : normalizeImageUrl(product.image.src);
  }
  
  // Si tiene array de imágenes
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return normalizeImageUrl(firstImage);
    }
    if (firstImage.src) {
      return normalizeImageUrl(firstImage.src);
    }
  }
  
  return null;
};

/**
 * Obtiene la imagen principal, priorizando una cuya URL o name contenga el texto indicado.
 * Útil para mostrar una foto específica (ej. "izquierda-frente-negra") en la ficha del producto.
 */
export const getProductMainImagePreferring = (product, preferredInNameOrSrc = '') => {
  if (!product) return null;
  const preferred = (preferredInNameOrSrc || '').toLowerCase().trim();
  if (preferred && product.images && product.images.length > 0) {
    for (const img of product.images) {
      const src = typeof img === 'string' ? img : (img?.src || img?.url || '');
      const name = typeof img === 'string' ? '' : (img?.name || img?.alt || '');
      const text = `${src} ${name}`.toLowerCase();
      if (text.includes(preferred)) {
        const url = typeof img === 'string' ? img : (img?.src || img?.url);
        if (url) return normalizeImageUrl(url);
      }
    }
  }
  return getProductMainImage(product);
};
