import { describe, it, expect } from 'vitest';
import cartReducer, {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  type CartState,
} from './cartSlice';
import type { CartItem } from '../../types/CartItem';
import type { Product } from '../../types/product';

const initialState: CartState = { items: [] };

// Пример продукта
const sampleProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 1000,
  category: { id: 1, name: 'laptops' }, // ✅ добавили id
  image: 'test.png',
};

// Пример CartItem
const sampleItem: CartItem = {
  id: sampleProduct.id.toString(),
  name: sampleProduct.name,
  price: sampleProduct.price,
  quantity: 1,
  category: sampleProduct.category.name,
  image: sampleProduct.image,
  product: sampleProduct,
};

describe('cartSlice', () => {
  it('должен вернуть initial state', () => {
    expect(cartReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setCartItems — заменяет список товаров', () => {
    const newItems = [{ ...sampleItem, id: '2' }];
    const state = cartReducer(initialState, setCartItems(newItems));
    expect(state.items).toEqual(newItems);
  });

  it('setCartItems — корректно обрабатывает пустой массив', () => {
    const stateWithItems = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItems, setCartItems([]));
    expect(state.items).toHaveLength(0);
  });

  it('addToCart — добавляет новый товар', () => {
    const state = cartReducer(initialState, addToCart(sampleItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Test Product');
    expect(state.items[0].product.id).toBe(1);
  });

  it('addToCart — увеличивает количество, если товар уже есть', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, addToCart({ ...sampleItem, quantity: 2 }));
    expect(state.items[0].quantity).toBe(3);
  });

  it('addToCart — не уменьшает количество при отрицательном значении', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, addToCart({ ...sampleItem, quantity: -2 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('removeFromCart — удаляет товар по id', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, removeFromCart(sampleItem.id));
    expect(state.items).toHaveLength(0);
  });

  it('removeFromCart — не изменяет state, если id не найден', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, removeFromCart('999'));
    expect(state.items).toHaveLength(1);
  });

  it('updateQuantity — обновляет количество товара', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, updateQuantity({ id: sampleItem.id, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('updateQuantity — удаляет товар, если количество <= 0', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, updateQuantity({ id: sampleItem.id, quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it('updateQuantity — ничего не делает, если товар не найден', () => {
    const stateWithItem = { items: [{ ...sampleItem }] };
    const state = cartReducer(stateWithItem, updateQuantity({ id: '999', quantity: 10 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clearCart — очищает корзину', () => {
    const stateWithItems = {
      items: [{ ...sampleItem }, { ...sampleItem, id: '2' }],
    };
    const state = cartReducer(stateWithItems, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
