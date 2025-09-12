import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { useCart } from './useCart';
import type { Product } from '../types/product';

// Моки Redux
vi.mock('./useAppDispatch', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('./useAppSelector', () => ({
  useAppSelector: vi.fn(),
}));

import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

// Экшены теперь возвращают объекты экшенов
vi.mock('../features/cart/cartSlice', () => ({
  setCartItems: (payload: any) => ({ type: 'setCartItems', payload }),
  addToCart: (payload: any) => ({ type: 'addToCart', payload }),
  updateQuantity: (payload: any) => ({ type: 'updateQuantity', payload }),
  removeFromCart: (payload: any) => ({ type: 'removeFromCart', payload }),
}));

//  Моки Apollo
const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();

vi.mock('@apollo/client', async () => {
  const actual: any = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useQuery: (...args: any[]) => mockUseQuery(...args),
    useMutation: (...args: any[]) => mockUseMutation(...args),
  };
});

describe('useCart', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();

    // Приведение к Mock для TS
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);
    (useAppSelector as unknown as Mock).mockImplementation((selector: any) =>
      selector({ cart: { items: [] } }),
    );

    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });
    mockUseMutation.mockReturnValue([vi.fn()]);
  });

  it('мапит данные из useQuery и вызывает setCartItems', () => {
    const fakeData = {
      cart: [
        {
          product: {
            id: 1,
            name: 'Товар',
            price: 100,
            image: '',
            category: { id: 1, name: 'Категория' },
          },
          quantity: 2,
        },
      ],
    };

    mockUseQuery.mockReturnValue({
      data: fakeData,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderHook(() => useCart(true));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'setCartItems',
        payload: expect.arrayContaining([
          expect.objectContaining({ id: '1', name: 'Товар', quantity: 2 }),
        ]),
      }),
    );
  });

  it('addToCart диспатчит addToCartAction и вызывает мутацию', async () => {
    const mockMutation = vi.fn().mockResolvedValue({});
    mockUseMutation.mockReturnValue([mockMutation]);

    const { result } = renderHook(() => useCart(false));

    const product: Product = {
      id: 1,
      name: 'Test',
      price: 10,
      image: '',
      category: { id: 1, name: 'Cat' },
    };

    await act(async () => {
      await result.current.addToCart(product, 1);
    });

    expect(dispatch).toHaveBeenCalled();
    expect(mockMutation).toHaveBeenCalledWith({
      variables: { productId: 1, quantity: 1 },
    });
  });

  it('updateQuantity вызывает мутацию и диспатч', async () => {
    const mockMutation = vi.fn().mockResolvedValue({});
    mockUseMutation.mockReturnValue([mockMutation]);

    const { result } = renderHook(() => useCart(false));

    await act(async () => {
      await result.current.updateQuantity('1', 5);
    });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'updateQuantity',
        payload: { id: '1', quantity: 5 },
      }),
    );
    expect(mockMutation).toHaveBeenCalledWith({
      variables: { productId: 1, quantity: 5 },
    });
  });

  it('removeFromCart вызывает мутацию и диспатч', async () => {
    const mockMutation = vi.fn().mockResolvedValue({});
    mockUseMutation.mockReturnValue([mockMutation]);

    const { result } = renderHook(() => useCart(false));

    await act(async () => {
      await result.current.removeFromCart('1');
    });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'removeFromCart',
        payload: '1',
      }),
    );
    expect(mockMutation).toHaveBeenCalledWith({
      variables: { productId: 1 },
    });
  });
});
