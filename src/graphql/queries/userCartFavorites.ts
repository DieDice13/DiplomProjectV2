import { gql } from '@apollo/client';

export const GET_MY_FAVORITES = gql`
  query GetMyFavorites {
    favorites {
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
