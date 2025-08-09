import { gql } from '@apollo/client';

export const GET_PRODUCTS_BY_IDS = gql`
  query GetProductsByIds($ids: [Int!]!) {
    productsByIds(ids: $ids) {
      id
      name
      price
      discount
      image
      category {
        id
        name
      }
    }
  }
`;
