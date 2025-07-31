import { gql } from '@apollo/client';

export const GET_PRODUCTS_FOR_SLIDER = gql`
  query GetProductsForSlider($category: String!) {
    products(category: $category, page: 1, limit: 10) {
      items {
        id
        name
        image
        price
        discount
        category {
          name
        }
      }
    }
  }
`;
