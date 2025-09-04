import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import authReducer from '../components/Auth/authSlice';
import {
  loadCartState,
  saveCartState,
  loadFavoritesState,
  saveFavoritesState,
} from '../utils/localStorage';

const preloadedState = {
  cart: loadCartState() || { items: [] },
  favorites: loadFavoritesState() || {
    items: [],
    loading: false,
    loadingAdd: false,
    loadingRemove: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveCartState(state.cart);
  saveFavoritesState(state.favorites);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
