import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/product';
import type { CartItem } from '../../types/CartItem';

import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';

// Общий мок хуков
vi.mock('../../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: vi.fn(),
}));

// Типизированные моки для удобства
const useCartMock = vi.mocked(useCart);
const useFavoritesMock = vi.mocked(useFavorites);

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 1000,
  discount: 50,
  category: { id: 1, name: 'Category' },
  image: 'test.jpg',
};

// 🔹 Заглушки "по умолчанию"
const baseCartMock = {
  cartItems: [] as CartItem[],
  loading: false,
  error: undefined,
  addToCart: vi.fn().mockResolvedValue(undefined),
  updateQuantity: vi.fn().mockResolvedValue(undefined),
  removeFromCart: vi.fn().mockResolvedValue(undefined),
  refetchCart: vi.fn().mockResolvedValue(undefined),
};

const baseFavoritesMock = {
  favorites: [] as Product[],
  loading: false,
  error: null,
  toggleFavorite: vi.fn().mockResolvedValue(undefined),
  refetchFavorites: vi.fn().mockResolvedValue(undefined),
  syncFavorites: vi.fn().mockResolvedValue(undefined),
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartMock.mockReturnValue({ ...baseCartMock });
    useFavoritesMock.mockReturnValue({ ...baseFavoritesMock });
  });

  it('рендерит цену со скидкой', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/1 000/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toHaveClass('font-bold');
  });

  it('рендерит обе цены при скидке', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    const originalPrice = screen.getByText(/1 000/, { selector: 'span.line-through' });
    const newPrice = screen.getByText(/500/, { selector: 'span.font-bold' });

    expect(originalPrice).toBeInTheDocument();
    expect(newPrice).toBeInTheDocument();
  });

  it('рендерит бейдж со скидкой', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/-50%/)).toBeInTheDocument();
  });

  it('вызывает toggleFavorite при клике на сердечко', () => {
    const toggleFavorite = vi.fn().mockResolvedValue(undefined);
    useFavoritesMock.mockReturnValue({
      ...baseFavoritesMock,
      toggleFavorite,
    });

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    const heart = document.querySelector('.lucide-heart') as SVGElement;
    fireEvent.click(heart);

    expect(toggleFavorite).toHaveBeenCalledTimes(1);
    expect(toggleFavorite).toHaveBeenCalledWith(mockProduct, false);
  });

  it('вызывает addToCart при клике на кнопку корзины', () => {
    const addToCart = vi.fn().mockResolvedValue(undefined);
    useCartMock.mockReturnValue({
      ...baseCartMock,
      cartItems: [],
      addToCart,
    });

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('показывает количество в корзине, если товар уже добавлен', () => {
    const cartItem: CartItem = {
      id: String(mockProduct.id),
      name: mockProduct.name,
      price: mockProduct.price,
      discount: mockProduct.discount,
      image: mockProduct.image,
      quantity: 2,
      category: mockProduct.category.name,
      product: mockProduct,
    };

    useCartMock.mockReturnValue({
      ...baseCartMock,
      cartItems: [cartItem],
    });

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});
