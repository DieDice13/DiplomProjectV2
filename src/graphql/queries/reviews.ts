import { gql } from '@apollo/client';

export const GET_REVIEWS_BY_PRODUCT = gql`
  query ReviewsByProduct($productId: Int!) {
    reviewsByProduct(productId: $productId) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
      }
    }
  }
`;
