import { GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries/products';
import { fetchGraphQL } from './graphqlClient';
import type { Product } from '../types/product';

export const getProductsByCategory = async (
  category: string,
  page = 0,
  limit = 10,
  filters?: Record<string, string[]>,
  sort?: 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC' | 'NAME_DESC',
): Promise<{ items: Product[]; totalCount: number }> => {
  const data = await fetchGraphQL<{
    products: { items: Product[]; totalCount: number };
  }>(GET_PRODUCTS_BY_CATEGORY, { category, page, limit, filters, sort });

  return data.products;
};
