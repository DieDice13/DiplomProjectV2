import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { useFavorites } from './useFavorites';
import type { Product } from '../types/product';

// --- Моки Redux ---
const addFavoriteMock = vi.fn();
const removeFavoriteMock = vi.fn();
const fetchFavoritesMock = vi.fn();
const fetchFavoritesByIdsMock = vi.fn();
const setFavoritesMock = vi.fn();
const addLocalFavoriteMock = vi.fn();
const removeLocalFavoriteMock = vi.fn();
const clearFavoritesMock = vi.fn();

vi.mock('./useAppDispatch', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('./useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));

import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

// возвращаем объект с unwrap
vi.mock('../features/favorites/favoritesSlice', () => ({
  addFavorite: (...args: any[]) => {
    addFavoriteMock(...args);
    return { unwrap: () => Promise.resolve(args[0]) };
  },
  removeFavorite: (...args: any[]) => {
    removeFavoriteMock(...args);
    return { unwrap: () => Promise.resolve(args[0]) };
  },
  fetchFavorites: (...args: any[]) => {
    fetchFavoritesMock(...args);
    return { unwrap: () => Promise.resolve(args[0]) };
  },
  fetchFavoritesByIds: (...args: any[]) => {
    fetchFavoritesByIdsMock(...args);
    return { unwrap: () => Promise.resolve(args[0]) };
  },
  setFavorites: (...args: any[]) => setFavoritesMock(...args),
  addLocalFavorite: (...args: any[]) => addLocalFavoriteMock(...args),
  removeLocalFavorite: (...args: any[]) => removeLocalFavoriteMock(...args),
  clearFavorites: (...args: any[]) => clearFavoritesMock(...args),
}));

// --- Тесты ---
describe('useFavorites', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {}); // убираем предупреждения
    dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);
    (useAppSelector as unknown as Mock).mockImplementation((selector: any) =>
      selector({
        auth: { user: { id: 1, name: 'User' } },
        favorites: {
          items: [],
          loading: false,
          loadingAdd: false,
          loadingRemove: false,
          error: null,
        },
      }),
    );
  });

  it('toggleFavorite добавляет продукт в локальное избранное для гостя', async () => {
    (useAppSelector as unknown as Mock).mockImplementation((selector: any) =>
      selector({
        auth: { user: null }, // гость
        favorites: {
          items: [],
          loading: false,
          loadingAdd: false,
          loadingRemove: false,
          error: null,
        },
      }),
    );

    const { result } = renderHook(() => useFavorites());

    const product: Product = {
      id: 5,
      name: 'Test Product',
      price: 100,
      image: '',
      category: { id: 1, name: 'Cat' },
    };

    await act(async () => {
      await result.current.toggleFavorite(product, false);
    });

    expect(addLocalFavoriteMock).toHaveBeenCalledWith(product);
  });

  it('toggleFavorite удаляет продукт из локального избранного для гостя', async () => {
    (useAppSelector as unknown as Mock).mockImplementation((selector: any) =>
      selector({
        auth: { user: null }, // гость
        favorites: {
          items: [{ id: 5 }],
          loading: false,
          loadingAdd: false,
          loadingRemove: false,
          error: null,
        },
      }),
    );

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.toggleFavorite(5, true);
    });

    expect(removeLocalFavoriteMock).toHaveBeenCalledWith(5);
  });

  it('toggleFavorite добавляет продукт на сервер для авторизованного', async () => {
    const { result } = renderHook(() => useFavorites());

    const product: Product = {
      id: 10,
      name: 'Server Product',
      price: 50,
      image: '',
      category: { id: 2, name: 'Cat2' },
    };

    await act(async () => {
      await result.current.toggleFavorite(product, false);
    });

    expect(addFavoriteMock).toHaveBeenCalledWith(product);
  });

  it('toggleFavorite удаляет продукт на сервере для авторизованного', async () => {
    (useAppSelector as unknown as Mock).mockImplementation((selector: any) =>
      selector({
        auth: { user: { id: 1, name: 'User' } },
        favorites: {
          items: [{ id: 10 }],
          loading: false,
          loadingAdd: false,
          loadingRemove: false,
          error: null,
        },
      }),
    );

    const { result } = renderHook(() => useFavorites());

    await act(async () => {
      await result.current.toggleFavorite(10, true);
    });

    expect(removeFavoriteMock).toHaveBeenCalledWith(10);
  });
});
