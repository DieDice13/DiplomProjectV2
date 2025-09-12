import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  type FavoritesState,
} from './favoritesSlice';
import type { Product } from '../../types/product';

// Мокаем Apollo Client
vi.mock('../../lib/apollClient', () => ({
  apolloClient: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}));

import { apolloClient } from '../../lib/apollClient';

const mockProduct: Product = {
  id: 1,
  name: 'Товар 1',
  price: 100,
  discount: 10,
  image: 'image.jpg',
  category: { id: 1, name: 'Категория' },
};

const makeStore = () =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  });

describe('favorites thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchFavorites успешно загружает избранное', async () => {
    (apolloClient.query as any).mockResolvedValue({
      data: { favorites: [mockProduct] },
    });

    const store = makeStore();
    await store.dispatch(fetchFavorites());

    const state: FavoritesState = store.getState().favorites;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Товар 1');
    expect(state.loading).toBe(false);
  });

  it('fetchFavorites обрабатывает ошибку', async () => {
    (apolloClient.query as any).mockRejectedValue(new Error('Network error'));

    const store = makeStore();
    await store.dispatch(fetchFavorites());

    const state: FavoritesState = store.getState().favorites;
    expect(state.error).toBe('Network error');
    expect(state.items).toHaveLength(0);
  });

  it('addFavorite добавляет товар в избранное', async () => {
    (apolloClient.mutate as any).mockResolvedValue({
      data: { addToFavorites: mockProduct },
    });

    const store = makeStore();
    await store.dispatch(addFavorite(mockProduct));

    const state: FavoritesState = store.getState().favorites;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(1);
  });

  it('removeFavorite удаляет товар из избранного', async () => {
    (apolloClient.mutate as any).mockResolvedValue({});

    const store = makeStore();
    // сначала добавим товар руками
    store.dispatch({ type: 'favorites/setFavorites', payload: [mockProduct] });

    await store.dispatch(removeFavorite(1));

    const state: FavoritesState = store.getState().favorites;
    expect(state.items).toHaveLength(0);
    expect(state.loadingRemove).toBe(false);
  });
});
