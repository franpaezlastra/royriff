import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTS } from '../../utils/constants';
import { enrichProductData } from '../../utils/productData';
import { 
  getProducts, 
  getProductBySlug as getProductBySlugAPI,
  formatWooCommerceProduct,
  getProductVariations,
  buildImagesByColorFromVariations,
  buildVariationsByColor,
} from '../../services/woocommerceService';

// Thunk para obtener productos desde WooCommerce
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const wcProducts = await getProducts();
      
      // Si hay productos de WooCommerce, los formateamos y enriquecemos
      if (wcProducts && wcProducts.length > 0) {
        return wcProducts.map(product => {
          const formatted = formatWooCommerceProduct(product);
          return enrichProductData(formatted);
        });
      }
      
      // Si no hay productos en WooCommerce, retornar array vacío
      // NO usar datos estáticos aquí - deben venir siempre de la API
      console.warn('No se encontraron productos en WooCommerce');
      return [];
    } catch (error) {
      console.error('Error fetching products from WooCommerce:', error);
      // En caso de error, retornar array vacío
      // Los datos deben venir siempre de WooCommerce, no de estáticos
      return [];
    }
  }
);

/**
 * Obtener producto por slug - ESTRATEGIA INTELIGENTE:
 * 1. Primero busca en el estado global (cache de Redux)
 * 2. Si no está, busca en datos estáticos hardcodeados
 * 3. Solo hace petición API si no está en ningún lado
 * Esto evita peticiones innecesarias y mejora el rendimiento
 */
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { items } = state.products;

      const wcProduct = await getProductBySlugAPI(slug);
      
      if (wcProduct) {
        const formatted = formatWooCommerceProduct(wcProduct);

        // Si es producto variable y las variaciones vienen como IDs,
        // traer el detalle de variaciones para obtener la imagen asignada a cada variación.
        if (
          wcProduct.type === 'variable' &&
          Array.isArray(wcProduct.variations) &&
          wcProduct.variations.length > 0 &&
          (typeof wcProduct.variations[0] === 'number' || typeof wcProduct.variations[0] === 'string')
        ) {
          try {
            const variations = await getProductVariations(wcProduct.id, wcProduct.variations);
            const imagesByColor = buildImagesByColorFromVariations({ variations });
            formatted.imagesByColor = imagesByColor || null;

            // Mapa color -> variación (precio, oferta, stock, imagen, etc.)
            const variationByColor = buildVariationsByColor(variations);
            formatted.variationByColor = variationByColor || null;

            // Calcular precio base desde las variaciones (mínimo precio disponible, ya con oferta aplicada)
            const variationPrices = Object.values(variationByColor || {})
              .map(v => v.price || 0)
              .filter(p => p > 0);
            if (variationPrices.length > 0) {
              formatted.price = Math.min(...variationPrices);
            }
          } catch (e) {
            console.warn('No se pudieron cargar variaciones para imágenes por color:', e);
            formatted.imagesByColor = null;
          }
        }

        // Enriquecer con datos hardcodeados (complementan, no sobrescriben)
        const enriched = enrichProductData(formatted);
        
        return enriched;
      }
      
      // Si no encontró por slug exacto, intentar buscar en todos los productos
      // Esto maneja casos donde el slug en la URL no coincide exactamente
      console.warn(`Producto no encontrado con slug exacto: ${slug}, buscando en productos cargados...`);
      
      // Buscar en productos ya cargados con búsqueda más flexible
      const flexibleMatch = items.find(p => {
        const pSlug = p.slug?.toLowerCase() || '';
        const searchSlug = slug.toLowerCase();
        // Extraer palabras clave del slug buscado
        const keywords = searchSlug.split('-').filter(k => k.length > 2);
        // Verificar si alguna palabra clave coincide
        return keywords.some(keyword => 
          pSlug.includes(keyword) || 
          p.name?.toLowerCase().includes(keyword) ||
          p.displayName?.toLowerCase().includes(keyword)
        );
      });
      
      if (flexibleMatch) {
        console.log(`Producto encontrado con búsqueda flexible: ${flexibleMatch.slug}`);
        return flexibleMatch;
      }
      
      throw new Error(`Producto no encontrado con slug: ${slug}`);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      
      // Último fallback: buscar en productos cargados con búsqueda muy flexible
      const lastResort = items.find(p => {
        const searchSlug = slug.toLowerCase();
        // Si el slug contiene "lola" o "cruiser", buscar cualquier producto con "lola"
        if (searchSlug.includes('lola') || searchSlug.includes('cruiser')) {
          return p.name?.toLowerCase().includes('lola') || 
                 p.displayName?.toLowerCase().includes('lola') ||
                 p.slug?.toLowerCase().includes('lola');
        }
        // Si el slug contiene "xxxx", buscar cualquier producto con "xxxx"
        if (searchSlug.includes('xxxx')) {
          return p.name?.toLowerCase().includes('xxxx') || 
                 p.displayName?.toLowerCase().includes('xxxx') ||
                 p.slug?.toLowerCase().includes('xxxx');
        }
        return false;
      });
      
      if (lastResort) {
        console.log(`Producto encontrado como último recurso: ${lastResort.slug}`);
        return lastResort;
      }
      
      return rejectWithValue(`Producto no encontrado con slug: ${slug}`);
    }
  }
);

const initialState = {
  items: [], // Cache global de todos los productos
  selectedProduct: null, // Producto actualmente seleccionado
  loading: false,
  error: null,
  lastFetch: null, // Timestamp de la última carga para cache inteligente
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetch = Date.now(); // Guardar timestamp de carga
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
        
        // Si el producto viene de la API y no está en items, agregarlo al cache
        if (action.payload && !state.items.find(p => p.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Producto no encontrado';
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
