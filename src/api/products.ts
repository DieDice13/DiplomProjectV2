import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries/products';
import type { Product } from '../types/product';

interface UseProductsOptions {
  category: string;
  page: number;
  limit: number;
  filters?: Record<string, string[]>;
  sort?: 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC' | 'NAME_DESC';
}

export const useProductsByCategory = ({
  category,
  page,
  limit,
  filters,
  sort,
}: UseProductsOptions) => {
  const { data, loading, error } = useQuery<{
    products: { items: Product[]; totalCount: number };
  }>(GET_PRODUCTS_BY_CATEGORY, {
    variables: { category, page, limit, filters, sort },
    skip: !category,
  });

  return {
    products: data?.products.items ?? [],
    totalCount: data?.products.totalCount ?? 0,
    loading,
    error,
  };
};
