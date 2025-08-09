import { gql } from '@apollo/client';

export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      quantity
      product {
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
  }
`;
