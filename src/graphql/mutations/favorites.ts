import { gql } from '@apollo/client';

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($productId: Int!) {
    addToFavorites(productId: $productId) {
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

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($productId: Int!) {
    removeFromFavorites(productId: $productId)
  }
`;
