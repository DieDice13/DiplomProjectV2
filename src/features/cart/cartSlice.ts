import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/CartItem';

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // заменяем весь список (используется при загрузке с сервера)
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      // нормализуем количество из payload
      const payloadQuantity = action.payload.quantity > 0 ? action.payload.quantity : 0;

      if (existingItem) {
        const newQuantity = existingItem.quantity + payloadQuantity;
        existingItem.quantity = newQuantity > 0 ? newQuantity : existingItem.quantity; // не уменьшаем ниже 1
      } else {
        state.items.push({ ...action.payload, quantity: payloadQuantity || 1 }); // если <=0, ставим 1
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return;

      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
