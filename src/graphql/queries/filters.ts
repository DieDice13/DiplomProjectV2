export const GET_ATTRIBUTES_BY_CATEGORY = `
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
