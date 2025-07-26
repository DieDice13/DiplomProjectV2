import { fetchGraphQL } from './graphqlClient';
import { GET_ATTRIBUTES_BY_CATEGORY } from '../graphql/queries/filters';
import type { AttributeWithValues } from '../features/catalog/components/types';

export const getAttributesByCategory = async (category: string): Promise<AttributeWithValues[]> => {
  const data = await fetchGraphQL<{ attributes: AttributeWithValues[] }>(
    GET_ATTRIBUTES_BY_CATEGORY,
    { category },
  );

  return data.attributes;
};
