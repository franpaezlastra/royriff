import { createSlice } from '@reduxjs/toolkit';
import { clearCheckoutStorage } from '../../utils/checkoutStorage';

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('royriff_cart');
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return [];
  }
};

// Guardar carrito en localStorage
const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('royriff_cart', serializedCart);
  } catch (err) {
    // Ignorar errores de escritura
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

// Clave única por renglón de carrito (producto + variación + color)
const buildLineKey = (product) => {
  const baseId = product.id || product.product_id || '';
  const variationId = product.variationId || '';
  const color = product.selectedColor || '';
  return `${baseId}::${variationId}::${color}`;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      // Diferenciar por ID de producto, variación y color seleccionado
      const lineKey = buildLineKey(product);
      const existingItem = state.items.find(
        item =>
          item.lineKey === lineKey
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          lineKey,
          quantity,
        });
      }
      
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const lineKey = action.payload;
      state.items = state.items.filter(item => item.lineKey !== lineKey);
      saveCartToStorage(state.items);
      if (state.items.length === 0) clearCheckoutStorage();
    },
    updateQuantity: (state, action) => {
      const { lineKey, quantity } = action.payload;
      const item = state.items.find(item => item.lineKey === lineKey);
      
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.lineKey !== lineKey);
        }
      }
      
      saveCartToStorage(state.items);
      if (state.items.length === 0) clearCheckoutStorage();
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
      clearCheckoutStorage();
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectores
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
