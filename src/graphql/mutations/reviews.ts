import { gql } from '@apollo/client';

export const ADD_REVIEW = gql`
  mutation AddReview($productId: Int!, $rating: Int!, $comment: String!) {
    addReview(productId: $productId, rating: $rating, comment: $comment) {
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
