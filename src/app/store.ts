// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import authReducer from '../features/auth/authSlice'; // ← Добавить

import { loadCartState, saveCartState } from '../utils/localStorage';

const preloadedState = {
  cart: loadCartState() || { items: [] },
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer, // ← Подключить
  },
  preloadedState,
});

store.subscribe(() => {
  saveCartState(store.getState().cart);
});

// Типы для хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
