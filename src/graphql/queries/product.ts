import { gql } from '@apollo/client';

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      price
      discount
      image
      description
      category {
        name
      }
      features
    }
  }
`;
