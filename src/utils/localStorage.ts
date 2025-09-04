import type { CartState } from '../features/cart/cartSlice';

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

export const loadFavoritesState = () => {
  try {
    const serializedState = localStorage.getItem('favorites');
    return serializedState ? JSON.parse(serializedState) : null;
  } catch {
    return null;
  }
};

export const saveFavoritesState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('favorites', serializedState);
  } catch {}
};
