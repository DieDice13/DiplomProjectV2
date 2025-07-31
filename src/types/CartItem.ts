export type CartItem = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  quantity: number;
  category: string; // ⬅️ добавлено
};
