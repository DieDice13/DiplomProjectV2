export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: number;
  category: Category;
  isFavorite?: boolean; // флаг для UI, не обязателен
};
