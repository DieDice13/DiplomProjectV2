export const fetchGraphQL = async <T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> => {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  console.log('[GraphQL RESULT]', result); // 👈 ОБЯЗАТЕЛЬНО!

  if (result.errors) {
    throw new Error(result.errors[0].message || 'GraphQL Error');
  }

  return result.data;
};
