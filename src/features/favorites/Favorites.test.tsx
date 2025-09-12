import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // ✅ добавляем

import cartReducer from '../cart/cartSlice';
import favoritesReducer from './favoritesSlice';
import authReducer from '../../components/Auth/authSlice';

import * as useFavoritesModule from '../../hooks/useFavorites';
import Favorites from './Favorites';

// --------------------
// Мок useFavorites
// --------------------
vi.mock('../../hooks/useFavorites', () => {
  let currentFavorites: any[] = [];

  return {
    useFavorites: () => ({
      favorites: currentFavorites,
      loading: false,
      error: null,
      toggleFavorite: vi.fn(),
      refetchFavorites: vi.fn(),
      syncFavorites: vi.fn(),
    }),
    __setFavorites: (favorites: any[]) => {
      currentFavorites = favorites;
    },
  };
});

// ✅ Мок useCart, чтобы не падал Apollo
vi.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    cartItems: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// --------------------
// Достаём __setFavorites
// --------------------
const { __setFavorites } = useFavoritesModule as unknown as {
  __setFavorites: (favorites: any[]) => void;
};

// --------------------
// Тестовый Redux store
// --------------------
const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: { items: [] },
      favorites: {
        items: [],
        loading: false,
        loadingAdd: false,
        loadingRemove: false,
        error: null,
      },
      auth: { user: null, isAuthInitialized: false },
    },
  });

const mockProduct = {
  id: 1,
  name: 'Тестовый продукт',
  price: 100,
  image: '',
  category: { name: 'Категория' },
};

// --------------------
// Тесты
// --------------------
describe('Favorites component', () => {
  it('показывает сообщение при пустом списке', () => {
    __setFavorites([]);
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          {' '}
          {/* ✅ добавлено */}
          <Favorites />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/избранное пусто/i)).toBeInTheDocument();
    expect(screen.getByText(/добавьте товары в избранное/i)).toBeInTheDocument();
  });

  it('показывает список товаров', () => {
    __setFavorites([mockProduct]);
    render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          {' '}
          {/* ✅ добавлено */}
          <Favorites />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(/тестовый продукт/i)).toBeInTheDocument();
  });
});
