import { describe, it, expect, beforeEach } from 'vitest';
import favoritesReducer, {
  clearFavorites,
  setFavorites,
  addLocalFavorite,
  removeLocalFavorite,
  type FavoritesState,
} from './favoritesSlice';
import type { Product } from '../../types/product';

const mockProduct: Product = {
  id: 1,
  name: 'Товар 1',
  price: 100,
  discount: 10,
  image: 'image.jpg',
  category: { id: 1, name: 'Категория' },
};

describe('favoritesSlice', () => {
  let initialState: FavoritesState;

  beforeEach(() => {
    initialState = {
      items: [],
      loading: false,
      loadingAdd: false,
      loadingRemove: false,
      error: null,
    };
  });

  it('clearFavorites очищает избранное', () => {
    const state = { ...initialState, items: [mockProduct] };
    const nextState = favoritesReducer(state, clearFavorites());
    expect(nextState.items).toEqual([]);
    expect(nextState.error).toBeNull();
  });

  it('setFavorites задаёт список избранного', () => {
    const nextState = favoritesReducer(initialState, setFavorites([mockProduct]));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].name).toBe('Товар 1');
  });

  it('addLocalFavorite добавляет товар, если его нет', () => {
    const nextState = favoritesReducer(initialState, addLocalFavorite(mockProduct));
    expect(nextState.items).toHaveLength(1);
  });

  it('addLocalFavorite не добавляет дубликат', () => {
    const state = { ...initialState, items: [mockProduct] };
    const nextState = favoritesReducer(state, addLocalFavorite(mockProduct));
    expect(nextState.items).toHaveLength(1);
  });

  it('removeLocalFavorite удаляет товар по id', () => {
    const state = { ...initialState, items: [mockProduct] };
    const nextState = favoritesReducer(state, removeLocalFavorite(1));
    expect(nextState.items).toHaveLength(0);
  });
});
