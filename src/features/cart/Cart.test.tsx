import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Product } from '../../types/product';
import type { CartItem } from '../../types/CartItem';

// Мокаем хук один раз глобально
vi.mock('../../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

import { useCart } from '../../hooks/useCart';

const mockAddToCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockRefetchCart = vi.fn();

// Создаём типизированную версию useCart
const mockedUseCart = vi.mocked(useCart);

// Вспомогательная функция для генерации CartItem
const createCartItem = (overrides?: Partial<CartItem>): CartItem => ({
  id: '1',
  name: 'Товар 1',
  price: 100,
  quantity: 2,
  image: 'test.jpg',
  product: {} as Product,
  category: 'test-category',
  ...overrides,
});

// Вспомогательный генератор мока useCart
const createCartMock = (overrides?: Partial<ReturnType<typeof useCart>>) => ({
  cartItems: [],
  loading: false,
  error: undefined,
  addToCart: mockAddToCart,
  updateQuantity: mockUpdateQuantity,
  removeFromCart: mockRemoveFromCart,
  refetchCart: mockRefetchCart,
  ...overrides,
});

describe('Cart component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает товары в корзине', async () => {
    mockedUseCart.mockReturnValue(createCartMock({ cartItems: [createCartItem()] }));

    const { default: Cart } = await import('./Cart');
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Товар 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Итого/i)).toBeInTheDocument();
  });

  it('отображает сообщение при пустой корзине', async () => {
    mockedUseCart.mockReturnValue(createCartMock({ cartItems: [] }));

    const { default: Cart } = await import('./Cart');
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(screen.getByText(/В вашей корзине пока нет товаров/i)).toBeInTheDocument();
  });

  it('отображает сообщение "Загрузка" при loading', async () => {
    mockedUseCart.mockReturnValue(createCartMock({ loading: true }));

    const { default: Cart } = await import('./Cart');
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(screen.getByText(text => text.includes('Загрузка корзины'))).toBeInTheDocument();
  });

  it('кнопка "Оформить заказ" отключена при пустой корзине', async () => {
    mockedUseCart.mockReturnValue(createCartMock({ cartItems: [] }));

    const { default: Cart } = await import('./Cart');
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /Оформить заказ/i })).toBeDisabled();
  });
});
