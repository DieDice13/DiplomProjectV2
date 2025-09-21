// export type Category = {
//   id: number;
//   name: string;
// };

// export type Product = {
//   id: number;
//   name: string;
//   image: string;
//   price: number;
//   discount?: number;
//   category: Category;
//   isFavorite?: boolean; // флаг для UI, не обязателен
// };

export type ProductFeatureMap = Record<string, string>;

export type ProductReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  } | null;
};

export type ProductAttributeForDetail = {
  name: string;
  value: string;
};

export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: number;
  category: {
    id: number;
    name: string;
  };
  isFavorite?: boolean;

  // опциональные поля для детальной страницы
  description?: string | null;
  features?: ProductFeatureMap | null;
  attributes?: ProductAttributeForDetail[] | null;
  reviews?: ProductReview[] | null;
};
