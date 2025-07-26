import { useEffect, useState } from 'react';
import ProductSlider from './ProductSlider';
import { getProductsByCategory } from '../../api/products';
import type { Product } from '../../types/product';

interface Props {
  category: string;
}

const ProductSliderContainer: React.FC<Props> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const result = await getProductsByCategory(category); // <-- тут используешь
        console.log(result);
        setProducts(result.items);
      } catch (err) {
        setError('Ошибка загрузки товаров');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [category]);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>Нет товаров в категории</p>;

  return <ProductSlider products={products} />;
};

export default ProductSliderContainer;
