export async function fetchProductsByCategory(category: string) {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Products($category: String!) {
          products(category: $category) {
            id
            name
            price
            image
          }
        }
      `,
      variables: {
        category,
      },
    }),
  });

  const json = await response.json();
  return json.data.products;
}
