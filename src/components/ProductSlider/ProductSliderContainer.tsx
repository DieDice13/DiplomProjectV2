import { useQuery } from '@apollo/client';
import ProductSlider from './ProductSlider';
import type { Product } from '../../types/product';
import { GET_PRODUCTS_FOR_SLIDER } from '../../graphql/queries/productsForSlider';

interface Props {
  category: string;
}

const ProductSliderContainer: React.FC<Props> = ({ category }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_FOR_SLIDER, {
    variables: { category },
  });

  if (loading) return <p>Загрузка...</p>;
  if (error) {
    console.error('Ошибка GraphQL:', error);
    return <p>Ошибка загрузки товаров</p>;
  }

  const products: Product[] = data?.products?.items || [];

  if (products.length === 0) return <p>Нет товаров в категории</p>;

  return <ProductSlider products={products} />;
};

export default ProductSliderContainer;
