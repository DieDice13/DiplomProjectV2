import { useEffect, useState } from 'react';
import ProductSlider from './ProductSlider';
import type { Product } from '../../types/product';

interface Props {
  category: string;
}

const ProductSliderContainer: React.FC<Props> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GetProducts($category: String) {
              products(category: $category) {
                id
                name
                price
                image
                discount
                category
              }
            }
          `,
            variables: { category },
          }),
        });

        const result = await response.json();

        // Приводим к нужному типу, переименовывая поля
        const formatted = result.data.products.map((product: any) => ({
          id: product.id,
          name: product.name, // <-- исправлено!
          price: product.price,
          image: product.image,
          discount: product.discount,
          category: product.category,
        }));

        setProducts(formatted);
      } catch (err) {
        setError('Ошибка загрузки товаров');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>Нет товаров в категории</p>;

  return <ProductSlider products={products} />;
};

export default ProductSliderContainer;
