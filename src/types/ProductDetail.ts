// src/types/ProductDetail.ts
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

export type ProductDetailType = {
  id: number;
  name: string;
  description?: string | null;
  image: string;
  price: number;
  discount: number;
  finalPrice?: number; // можешь заполнять на back или высчитывать на front
  category: {
    name: string;
  };
  isFavorite?: boolean;
  // Здесь — карта характеристик (ключ -> значение). Именно такое поле формирует сервер.
  features?: ProductFeatureMap | null;

  // Если где-то используется массив атрибутов — оставляем опционально.
  attributes?: ProductAttributeForDetail[] | null;

  // Отзывы
  reviews?: ProductReview[] | null;
};
