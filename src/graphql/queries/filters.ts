import { gql } from '@apollo/client';

export const GET_ATTRIBUTES_BY_CATEGORY = gql`
  query GetAttributesByCategory($category: String!) {
    attributes(category: $category) {
      key
      label
      type
      values {
        value
        count
      }
    }
  }
`;
