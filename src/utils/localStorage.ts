import type { CartState } from '../features/cart/cartSlice';
import type { FavoritesState } from '../features/favorites/favoritesSlice'; // добавь, если нужно

export const loadCartState = (): CartState | undefined => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as CartState;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Ошибка загрузки состояния корзины:', err);
    }
    return undefined;
  }
};

export const saveCartState = (state: CartState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Ошибка сохранения состояния корзины:', err);
    }
  }
};

// ⬇️ новые функции для избранного

export const loadFavoritesState = (): FavoritesState | undefined => {
  try {
    const serializedState = localStorage.getItem('favorites');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as FavoritesState;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Ошибка загрузки состояния избранного:', err);
    }
    return undefined;
  }
};

export const saveFavoritesState = (state: FavoritesState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('favorites', serializedState);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Ошибка сохранения состояния избранного:', err);
    }
  }
};
