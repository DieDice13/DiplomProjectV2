// useCart.ts
import { useQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  setCartItems,
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
} from '../features/cart/cartSlice';
import type { CartItem } from '../types/CartItem';
import type { Product } from '../types/product';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
} from '../graphql/mutations/cart';

export function useCart(loadOnMount = true) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);

  const { data, loading, error, refetch } = useQuery(GET_CART, {
    skip: !loadOnMount,
    fetchPolicy: 'network-only',
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    onCompleted: () => refetch().catch(() => {}),
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, {
    onCompleted: () => refetch().catch(() => {}),
  });

  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    onCompleted: () => refetch().catch(() => {}),
  });

  // Мапим данные с сервера в CartItem
  useEffect(() => {
    if (data?.cart) {
      const mapped: CartItem[] = data.cart.map((ci: any) => ({
        id: String(ci.product.id),
        name: ci.product.name,
        price: ci.product.price,
        discount: ci.product.discount ?? undefined,
        image: ci.product.image ?? '',
        quantity: ci.quantity,
        category: ci.product.category?.name ?? '',
        product: {
          id: ci.product.id,
          name: ci.product.name,
          price: ci.product.price,
          discount: ci.product.discount ?? undefined,
          image: ci.product.image ?? '',
          category: ci.product.category,
          // Добавь остальные поля Product, если есть
        } as Product,
      }));
      dispatch(setCartItems(mapped));
    }
  }, [data, dispatch]);

  const addToCart = async (product: Product, quantity = 1) => {
    const idStr = String(product.id);
    const payload: CartItem = {
      id: idStr,
      name: product.name,
      price: product.price,
      discount: product.discount ?? undefined,
      image: product.image ?? '',
      quantity,
      category: product.category?.name ?? '',
      product,
    };

    const existing = cartItems.find(i => i.id === idStr);
    if (existing) {
      dispatch(updateQuantityAction({ id: idStr, quantity: existing.quantity + quantity }));
    } else {
      dispatch(addToCartAction(payload));
    }

    try {
      await addToCartMutation({
        variables: { productId: Number(product.id), quantity },
      });
    } catch (err) {
      console.error('addToCart mutation failed', err);
      await refetch().catch(() => {});
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch(updateQuantityAction({ id: productId, quantity }));
    try {
      await updateCartItemMutation({
        variables: { productId: Number(productId), quantity },
      });
    } catch (err) {
      console.error('updateCartItem failed', err);
      await refetch().catch(() => {});
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch(removeFromCartAction(productId));
    try {
      await removeFromCartMutation({
        variables: { productId: Number(productId) },
      });
    } catch (err) {
      console.error('removeFromCart failed', err);
      await refetch().catch(() => {});
    }
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    refetchCart: refetch,
  };
}
