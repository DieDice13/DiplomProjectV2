import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';

import Catalog from './Catalog';
import { store } from '../../app/store';
import type { Product } from '../../types/product';
import type { AttributeWithValues } from './components/types';
import type { ApolloError } from '@apollo/client';

// 🔹 мок framer-motion (убираем анимации, делаем синхронно)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<any>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: new Proxy(actual.motion, {
      get: (target, key) => {
        if (key === 'div') {
          return (props: any) => <div {...props} />;
        }
        return target[key];
      },
    }),
  };
});

// 🔹 создаём мокнутый Apollo Client
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

// 🔹 мокаем хуки API
vi.mock('../../api/products', () => ({
  useProductsByCategory: vi.fn(),
}));

vi.mock('../../api/filters', () => ({
  useAttributesByCategory: vi.fn(),
}));

import { useProductsByCategory } from '../../api/products';
import { useAttributesByCategory } from '../../api/filters';

const mockedUseProductsByCategory = vi.mocked(useProductsByCategory);
const mockedUseAttributesByCategory = vi.mocked(useAttributesByCategory);

describe('Catalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = async (category: string) => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ApolloProvider client={client}>
            <MemoryRouter initialEntries={[`/${category}`]}>
              <Routes>
                <Route path="/:category" element={<Catalog />} />
              </Routes>
            </MemoryRouter>
          </ApolloProvider>
        </Provider>,
      );
    });
  };

  it('показывает лоадеры, пока загружаются продукты и фильтры', async () => {
    mockedUseProductsByCategory.mockReturnValue({
      products: [],
      totalCount: 0,
      loading: true,
      error: undefined,
    });

    mockedUseAttributesByCategory.mockReturnValue({
      attributes: [
        { key: 'brand', label: 'Бренд', type: 'string', values: [{ value: 'Samsung', count: 1 }] },
      ],
      loading: true,
      error: undefined,
    });

    await renderWithRouter('smartphones');
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('показывает сообщение об ошибке, если API вернул ошибку', async () => {
    mockedUseProductsByCategory.mockReturnValue({
      products: [],
      totalCount: 0,
      loading: false,
      error: {} as ApolloError, // подставляем мок ошибки
    });

    mockedUseAttributesByCategory.mockReturnValue({
      attributes: [],
      loading: false,
      error: undefined,
    });

    await renderWithRouter('laptops');
    expect(screen.getByText(/Не удалось загрузить продукты/i)).toBeInTheDocument();
  });

  it('показывает сообщение, если товаров нет', async () => {
    mockedUseProductsByCategory.mockReturnValue({
      products: [],
      totalCount: 0,
      loading: false,
      error: undefined,
    });

    mockedUseAttributesByCategory.mockReturnValue({
      attributes: [],
      loading: false,
      error: undefined,
    });

    await renderWithRouter('microwaves');
    expect(screen.getByText(/ничего не найдено/i)).toBeInTheDocument();
  });

  it('рендерит список продуктов и фильтры', async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'iPhone',
        price: 1000,
        discount: 0,
        image: 'iphone.jpg',
        category: { id: 1, name: 'Smartphones' },
      },
      {
        id: 2,
        name: 'Galaxy',
        price: 800,
        discount: 10,
        image: 'galaxy.jpg',
        category: { id: 1, name: 'Smartphones' },
      },
    ];

    const mockFilters: AttributeWithValues[] = [
      {
        key: 'color',
        label: 'Цвет',
        type: 'string',
        values: [{ value: 'Red', count: 5 }],
      },
    ];

    mockedUseProductsByCategory.mockReturnValue({
      products: mockProducts,
      totalCount: 2,
      loading: false,
      error: undefined,
    });

    mockedUseAttributesByCategory.mockReturnValue({
      attributes: mockFilters,
      loading: false,
      error: undefined,
    });

    await renderWithRouter('smartphones');

    expect(screen.getByText(/iPhone/)).toBeInTheDocument();
    expect(screen.getByText(/Galaxy/)).toBeInTheDocument();
    expect(screen.getByText(/Цвет/)).toBeInTheDocument();
  });

  it('открывает и закрывает фильтры на мобильной версии', async () => {
    mockedUseProductsByCategory.mockReturnValue({
      products: [
        {
          id: 1,
          name: 'Телевизор Samsung',
          price: 1500,
          discount: 0,
          image: 'tv.jpg',
          category: { id: 10, name: 'Televisions' },
        },
      ],
      totalCount: 1,
      loading: false,
      error: undefined,
    });

    mockedUseAttributesByCategory.mockReturnValue({
      attributes: [
        {
          key: 'brand',
          label: 'Бренд',
          type: 'string',
          values: [{ value: 'Samsung', count: 1 }],
        },
      ],
      loading: false,
      error: undefined,
    });

    await renderWithRouter('televisions');

    await act(async () => {
      fireEvent.click(screen.getByText(/Фильтры/i));
    });
    expect(screen.getByText(/Закрыть/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(/Закрыть/i));
    });
    expect(screen.queryByText(/Закрыть/i)).not.toBeInTheDocument();
  });
});
