import type { Product } from './product';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  product: Product;
  category: string; // ⬅️ добавлено
};
