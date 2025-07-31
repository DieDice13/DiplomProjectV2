import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries/product';
import type { Product } from '../types/product';

export const useProductById = (id: string) => {
  return useQuery<{ product: Product }>(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });
};
