import { useQuery } from '@apollo/client';
import { GET_ATTRIBUTES_BY_CATEGORY } from '../graphql/queries/filters';
import type { AttributeWithValues } from '../features/catalog/components/types';

export const useAttributesByCategory = (category: string) => {
  const { data, loading, error } = useQuery<{ attributes: AttributeWithValues[] }>(
    GET_ATTRIBUTES_BY_CATEGORY,
    {
      variables: { category },
      skip: !category,
    },
  );

  return {
    attributes: data?.attributes ?? [],
    loading,
    error,
  };
};
