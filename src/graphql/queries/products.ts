﻿export const GET_PRODUCTS_BY_CATEGORY = `
  query GetProductsByCategory(
    $category: String!
    $page: Int!
    $limit: Int!
    $filters: JSON
    $sort: SortOption
  ) {
    products(category: $category, page: $page, limit: $limit, filters: $filters, sort: $sort) {
      items {
        id
        name
        price
        image
        discount
      }
      totalCount
    }
  }
`;
