import axios from 'axios';

// Configuración: usar siempre el proxy del plugin (/api/) para seguridad
// El proxy maneja las credenciales en el servidor, nunca se exponen al navegador
// En desarrollo (localhost): Vite proxy en vite.config.js reenvía /api a api.royriff.com.ar (TEMPORAL, eliminar proxy al publicar)
const API_BASE_URL = '/api';

// Crear instancia de axios que usa nuestro proxy seguro
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// NO enviamos credenciales desde el navegador - el proxy las maneja en el servidor

/**
 * Obtener todos los productos
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', {
      params: {
        per_page: 100,
        status: 'publish',
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener variaciones de un producto variable
 * Soporta filtrar por IDs (include) cuando el producto trae variations: [85, 84]
 */
export const getProductVariations = async (productId, variationIds = []) => {
  try {
    const params = {
      per_page: 100,
    };
    if (Array.isArray(variationIds) && variationIds.length > 0) {
      params.include = variationIds.join(',');
    }
    const response = await api.get(`/products/${productId}/variations`, { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching variations for product ${productId}:`, error);
    throw error;
  }
};

/**
 * Obtener un producto por slug
 * Si el API devuelve un array con un solo producto ([{ ... }]), se devuelve ese objeto.
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/products/slug/${slug}`);
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) return data[0];
    return data;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Construir URL de checkout de WooCommerce (solo para redirección si es necesario)
 * NOTA: Con checkout 100% React, esto ya no se usa, pero lo mantenemos por compatibilidad
 */
export const getCheckoutUrl = async (items) => {
  const baseUrl = import.meta.env.VITE_WOOCOMMERCE_URL || window.location.origin;
  
  if (items.length === 0) {
    return `${baseUrl}/checkout/`;
  }

  // Si hay un solo producto, usar el método directo
  if (items.length === 1) {
    const productId = items[0].id;
    const quantity = items[0].quantity || 1;
    return `${baseUrl}/checkout/?add-to-cart=${productId}&quantity=${quantity}`;
  }

  // Para múltiples productos, construir URL con todos los parámetros
  // WooCommerce acepta múltiples add-to-cart en la URL
  const params = items
    .map((item) => {
      const productId = item.id;
      const quantity = item.quantity || 1;
      return `add-to-cart[]=${productId}&quantity[]=${quantity}`;
    })
    .join('&');

  return `${baseUrl}/checkout/?${params}`;
};

/**
 * Versión síncrona simple para uso directo (mantiene compatibilidad)
 * Para múltiples productos, redirige al checkout y WooCommerce manejará el carrito
 */
export const getCheckoutUrlSync = (items) => {
  const baseUrl = import.meta.env.VITE_WOOCOMMERCE_URL || window.location.origin;
  
  if (items.length === 0) {
    return `${baseUrl}/checkout/`;
  }

  // Si hay un solo producto, usar el método directo
  if (items.length === 1) {
    const productId = items[0].id;
    const quantity = items[0].quantity || 1;
    return `${baseUrl}/checkout/?add-to-cart=${productId}&quantity=${quantity}`;
  }

  // Para múltiples productos, construir URL con todos los parámetros
  // Nota: WooCommerce puede no soportar múltiples add-to-cart directamente
  // En ese caso, mejor redirigir a /checkout/ y usar la API para agregar productos
  const params = items
    .map((item) => {
      const productId = item.id;
      const quantity = item.quantity || 1;
      return `add-to-cart[]=${productId}&quantity[]=${quantity}`;
    })
    .join('&');

  return `${baseUrl}/checkout/?${params}`;
};

/**
 * Obtener métodos de pago disponibles
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/payment_gateways');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Obtener métodos de envío disponibles
 */
export const getShippingMethods = async () => {
  try {
    const response = await api.get('/shipping_methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    throw error;
  }
};

/**
 * Calcular costos de envío por código postal
 * @param {Object} params - Parámetros de cálculo
 * @param {string} params.postcode - Código postal
 * @param {string} [params.city] - Ciudad (opcional)
 * @param {string} [params.state] - Provincia (opcional)
 * @param {Array} params.line_items - Productos del carrito [{product_id, quantity}]
 * @returns {Promise<Object>} { postcode, options: [{id, title, cost, method_id}] }
 */
export const calculateShipping = async ({ postcode, city, state, line_items }) => {
  try {
    if (!postcode || !line_items || line_items.length === 0) {
      throw new Error('Código postal y productos son requeridos');
    }

    const response = await api.post('/shipping/calculate', {
      postcode,
      city: city || '',
      state: state || '',
      line_items: line_items.map(item => ({
        product_id: parseInt(item.product_id || item.id),
        quantity: parseInt(item.quantity || 1),
      })),
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    throw error;
  }
};

/**
 * Crear una orden en WooCommerce
 */
export const createOrder = async (orderData) => {
  try {
    // Validar que los datos requeridos estén presentes
    if (!orderData.billing || !orderData.billing.email) {
      throw new Error('Email de facturación es requerido');
    }
    if (!orderData.line_items || orderData.line_items.length === 0) {
      throw new Error('La orden debe tener al menos un producto');
    }

    // URLs de retorno para React (frontend)
    // IMPORTANTE: Usar el dominio actual donde está corriendo React
    // Esto asegura que funcione tanto en desarrollo como en producción
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    // Si React está en el mismo dominio que WordPress, usar origen actual
    // Si está en otro dominio, usar variable de entorno
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || currentOrigin || 'https://api.royriff.com.ar';
    const returnUrl = `${frontendUrl}/compra-confirmada`;
    const cancelUrl = `${frontendUrl}/pedido-cancelado`;
    
    // Debug: mostrar URLs de retorno (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.log('Return URLs:', { returnUrl, cancelUrl, frontendUrl, currentOrigin });
    }

    // Determinar el estado inicial según el método de pago
    const isTransferencia = orderData.payment_method && (
      orderData.payment_method.includes('bacs') ||
      orderData.payment_method.includes('transfer') ||
      orderData.payment_method.includes('bank') ||
      orderData.payment_method.includes('offline')
    );
    
    // Para transferencia bancaria, usar "on-hold" para que WooCommerce envíe el email
    // Para otros métodos, usar "pending" hasta que se procese el pago
    const initialStatus = isTransferencia ? 'on-hold' : 'pending';
    
    // Preparar datos de la orden según formato de WooCommerce API
    const orderPayload = {
      payment_method: orderData.payment_method || '',
      payment_method_title: orderData.payment_method_title || '',
      set_paid: false, // No marcar como pagada hasta que se procese el pago
      status: initialStatus, // "on-hold" para transferencia (envía email), "pending" para otros
      billing: {
        first_name: orderData.billing.first_name || '',
        last_name: orderData.billing.last_name || '',
        email: orderData.billing.email || '',
        phone: orderData.billing.phone || '',
        address_1: orderData.billing.address_1 || '',
        address_2: orderData.billing.address_2 || '',
        city: orderData.billing.city || '',
        state: orderData.billing.state || '',
        postcode: orderData.billing.postcode || '',
        country: orderData.billing.country || 'AR',
      },
      shipping: {
        first_name: orderData.shipping.first_name || orderData.billing.first_name || '',
        last_name: orderData.shipping.last_name || orderData.billing.last_name || '',
        address_1: orderData.shipping.address_1 || orderData.billing.address_1 || '',
        address_2: orderData.shipping.address_2 || orderData.billing.address_2 || '',
        city: orderData.shipping.city || orderData.billing.city || '',
        state: orderData.shipping.state || orderData.billing.state || '',
        postcode: orderData.shipping.postcode || orderData.billing.postcode || '',
        country: orderData.shipping.country || orderData.billing.country || 'AR',
      },
      line_items: orderData.line_items.map(item => {
        const productId = parseInt(item.product_id || item.id);
        const variationId = item.variationId ? parseInt(item.variationId) : undefined;
        const base = {
          product_id: productId,
          quantity: parseInt(item.quantity || 1),
        };
        if (variationId) {
          base.variation_id = variationId;
        }
        if (item.selectedColor) {
          base.meta_data = [
            { key: 'pa_color', value: item.selectedColor },
            { key: 'Color', value: item.selectedColor },
          ];
        }
        return base;
      }),
      // Solo incluir shipping_lines si hay métodos válidos con method_id
      // Si está vacío o no tiene method_id válido, no lo enviamos
      // WooCommerce calculará el envío automáticamente
      ...(orderData.shipping_lines && 
          orderData.shipping_lines.length > 0 && 
          orderData.shipping_lines[0].method_id ? 
          { shipping_lines: orderData.shipping_lines } : {}),
      fee_lines: orderData.fee_lines || [],
      meta_data: [
        ...(orderData.meta_data || []),
        {
          key: '_react_return_url',
          value: returnUrl,
        },
        {
          key: '_react_cancel_url',
          value: cancelUrl,
        },
      ],
    };

    // Log para debug (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.log('Creating order with payload:', JSON.stringify(orderPayload, null, 2));
    }

    const response = await api.post('/orders', orderPayload);
    
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    // Mostrar más detalles del error
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      // Lanzar error con mensaje más descriptivo
      const errorMessage = error.response.data?.message || 
                          JSON.stringify(error.response.data) || 
                          'Error al crear la orden';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Actualizar una orden existente
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Obtener una orden por ID
 */
export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Atributos que WooCommerce puede usar para el color (en orden de preferencia)
 */
const COLOR_ATTR_NAMES = ['pa_color', 'color', 'Color', 'attribute_pa_color'];

/**
 * Normaliza el nombre del atributo para comparar (pa_color, attribute_pa_color, etc.)
 */
function normAttrName(name) {
  if (!name) return '';
  const s = String(name).toLowerCase();
  return s.replace(/^attribute_/, '');
}

/**
 * Obtiene el nombre del color de una variación desde attributes
 */
function getColorFromVariation(variation) {
  const attrs = variation?.attributes || variation?.options || [];
  if (!Array.isArray(attrs)) return null;

  for (const attr of attrs) {
    const name = normAttrName(attr.name ?? attr.id ?? '');
    if (!name) continue;
    if (COLOR_ATTR_NAMES.some((n) => normAttrName(n) === name || name.includes('color'))) {
      const option = attr.option ?? attr.value ?? attr;
      if (option && typeof option === 'string') return option.trim();
    }
  }
  return null;
}

/**
 * Obtiene la imagen principal de una variación (objeto con src y opcional alt)
 */
function getVariationImage(variation) {
  const img = variation?.image ?? variation?.images?.[0];
  if (!img) return null;
  const src = typeof img === 'string' ? img : img?.src ?? img?.url;
  if (!src) return null;
  const alt = typeof img === 'string' ? '' : (img.alt ?? img.name ?? '');
  return { src, alt };
}

/**
 * Construye imagesByColor a partir de las variaciones del producto WooCommerce.
 * Espera wcProduct.variations como array de objetos con attributes (o options) e image (o images).
 * Si variations es solo un array de IDs, no se puede construir y retorna null.
 */
export function buildImagesByColorFromVariations(wcProduct) {
  const variations = wcProduct?.variations;
  if (!Array.isArray(variations) || variations.length === 0) return null;

  const byColor = {};

  for (const v of variations) {
    if (typeof v === 'number' || typeof v === 'string') continue;
    const colorName = getColorFromVariation(v);
    const image = getVariationImage(v);
    if (!colorName || !image) continue;
    if (!byColor[colorName]) byColor[colorName] = [];
    byColor[colorName].push(image);
  }

  return Object.keys(byColor).length > 0 ? byColor : null;
}

/**
 * Construye un mapa color -> datos de variación (precio, oferta, stock, imagen, etc.)
 */
export function buildVariationsByColor(variations) {
  if (!Array.isArray(variations) || variations.length === 0) return null;

  const byColor = {};

  for (const v of variations) {
    const colorName = getColorFromVariation(v);
    if (!colorName) continue;

    const price = parseFloat(v.price || v.regular_price) || 0;
    const regularPrice = parseFloat(v.regular_price) || price || 0;
    const salePrice = v.sale_price ? parseFloat(v.sale_price) : null;
    const onSale = !!v.on_sale || (salePrice !== null && salePrice > 0 && salePrice < regularPrice);

    byColor[colorName] = {
      id: v.id,
      color: colorName,
      price,
      regularPrice,
      salePrice,
      onSale,
      stockStatus: v.stock_status || 'instock',
      stockQuantity: v.stock_quantity ?? null,
      sku: v.sku || '',
      image: v.image || null,
      raw: v,
    };
  }

  return Object.keys(byColor).length > 0 ? byColor : null;
}

/**
 * Obtiene las opciones de color del producto (ej. ["Champagne Metallic", "Graphite Pearl"])
 */
function getColorOptionsFromProduct(wcProduct) {
  const attrs = wcProduct?.attributes || [];
  if (!Array.isArray(attrs)) return [];
  for (const attr of attrs) {
    const name = normAttrName(attr.name ?? attr.slug ?? attr.id ?? '');
    if (!name || !COLOR_ATTR_NAMES.some((n) => normAttrName(n) === name || name.includes('color'))) continue;
    const options = attr.options || [];
    if (Array.isArray(options) && options.length > 0) return options.map((o) => String(o).trim()).filter(Boolean);
  }
  return [];
}

/**
 * Asigna una imagen del array product.images a un color según name, alt o src.
 * Coincidencias: nombre/alt del color, o en URL/nombre "verde"→Champagne, "negra"/"NEGRA"→Graphite, etc.
 */
function assignImageToColor(img, colorOptions) {
  const src = typeof img === 'string' ? img : (img?.src ?? img?.url ?? '');
  const name = typeof img === 'string' ? '' : (img?.name ?? '');
  const alt = typeof img === 'string' ? '' : (img?.alt ?? '');
  const text = `${name} ${alt} ${src}`.toLowerCase();
  const decoded = text.replace(/&#8211;/g, '-').replace(/&#\d+;/g, ' ');

  for (const color of colorOptions) {
    const colorLower = color.toLowerCase();
    if (decoded.includes(colorLower)) return color;
    const firstWord = color.split(/\s+/)[0];
    if (firstWord && decoded.includes(firstWord.toLowerCase())) return color;
  }

  if (/verde|champagne/i.test(decoded)) return colorOptions.find((c) => /champagne/i.test(c)) || colorOptions[0];
  if (/negra|negro|graphite|black/i.test(decoded)) return colorOptions.find((c) => /graphite|negro|black/i.test(c)) || colorOptions[colorOptions.length - 1];

  return null;
}

/**
 * Construye imagesByColor a partir del array product.images cuando las variaciones
 * no vienen expandidas (solo IDs). Usa el atributo Color del producto y asigna cada
 * imagen a un color según name/alt/src (ej. "Champagne Metallic", "Graphite Pearl", "verde", "negra").
 */
export function buildImagesByColorFromProductImages(wcProduct) {
  const images = wcProduct?.images;
  const colorOptions = getColorOptionsFromProduct(wcProduct);
  if (!Array.isArray(images) || images.length === 0 || colorOptions.length === 0) return null;

  const byColor = {};
  for (const opt of colorOptions) byColor[opt] = [];

  for (const img of images) {
    const colorName = assignImageToColor(img, colorOptions);
    if (!colorName || !byColor[colorName]) continue;
    const src = typeof img === 'string' ? img : (img?.src ?? img?.url);
    if (!src) continue;
    const alt = typeof img === 'string' ? '' : (img?.alt ?? img?.name ?? '');
    byColor[colorName].push({ src, alt });
  }

  const hasAny = Object.values(byColor).some((arr) => arr.length > 0);
  return hasAny ? byColor : null;
}

/**
 * Formatear producto de WooCommerce a formato interno
 * Incluye imagesByColor: primero desde variaciones expandidas; si no, desde product.images por color.
 */
export const formatWooCommerceProduct = (wcProduct) => {
  // Importante: NO armar imagesByColor desde product.images (galería).
  // Para mostrar solo la imagen cargada en Variaciones, imagesByColor debe venir de variaciones expandidas.
  const imagesByColor = buildImagesByColorFromVariations(wcProduct);

  return {
    id: wcProduct.id.toString(),
    name: wcProduct.name,
    slug: wcProduct.slug,
    type: wcProduct.type,
    variations: wcProduct.variations || [],
    attributes: wcProduct.attributes || [],
    price: parseFloat(wcProduct.price) || 0,
    regularPrice: parseFloat(wcProduct.regular_price) || 0,
    salePrice: wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : null,
    description: wcProduct.description || '',
    shortDescription: wcProduct.short_description || '',
    sku: wcProduct.sku || '',
    stockStatus: wcProduct.stock_status || 'instock',
    stockQuantity: wcProduct.stock_quantity || 0,
    images: wcProduct.images || [],
    categories: wcProduct.categories || [],
    tags: wcProduct.tags || [],
    weight: wcProduct.weight || '',
    dimensions: wcProduct.dimensions || {},
    permalink: wcProduct.permalink || '',
    ...(imagesByColor && { imagesByColor }),
  };
};

export default {
  getProducts,
  getProductById,
  getProductVariations,
  getProductBySlug,
  getCheckoutUrl,
  getCheckoutUrlSync,
  getPaymentMethods,
  getShippingMethods,
  calculateShipping,
  createOrder,
  updateOrder,
  getOrder,
  calculateShipping,
  formatWooCommerceProduct,
};
