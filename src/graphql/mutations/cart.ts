import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart {
    cart {
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

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
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

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: Int!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
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

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: Int!) {
    removeFromCart(productId: $productId)
  }
`;
