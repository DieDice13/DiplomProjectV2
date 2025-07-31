import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import styles from './ProductDetail.module.scss';
import { GET_PRODUCT_BY_ID } from '../../graphql/queries/product';
import { GET_ATTRIBUTES_BY_CATEGORY } from '../../graphql/queries/filters';

type Attribute = {
  key: string;
  label: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  description: string;
  category: { name: string };
  features: Record<string, string>;
};

export default function ProductDetail() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [reviews] = useState<{ rating: number }[]>([
    { rating: 4 },
    { rating: 5 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
  ]);

  const {
    data: productData,
    loading: loadingProduct,
    error: errorProduct,
  } = useQuery<{ product: Product }>(GET_PRODUCT_BY_ID, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  const {
    data: attributesData,
    loading: loadingAttributes,
    error: errorAttributes,
  } = useQuery<{ attributes: Attribute[] }>(GET_ATTRIBUTES_BY_CATEGORY, {
    variables: { category: category ?? '' },
    skip: !category,
  });

  if (loadingProduct || loadingAttributes) return <div>Загрузка...</div>;
  if (errorProduct || errorAttributes) return <div>Ошибка при загрузке данных</div>;

  const product = productData?.product;
  const attributes = attributesData?.attributes ?? [];

  if (!product) return <div>Товар не найден</div>;

  const finalPrice = product.price * (1 - product.discount / 100);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round(sum / reviews.length);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(prev => !prev);
  };

  const renderFeatures = () =>
    attributes.map(attr => {
      const value = product.features[attr.key];
      return value ? (
        <li key={attr.key}>
          <strong>{attr.label}:</strong> {value}
        </li>
      ) : null;
    });

  return (
    <div className={styles['product-detail']}>
      <h1 className={styles['product-detail__title']}>{product.name}</h1>

      <div className={styles['product-detail__area-user-controls']}>
        <ul className={styles['product-detail__star-rating']}>
          {Array.from({ length: 5 }, (_, index) => (
            <li
              key={index}
              className={
                index < calculateAverageRating() ? styles['product-detail__star--filled'] : ''
              }
            >
              ★
            </li>
          ))}
          <p className={styles['product-detail__star-indicator']}>({reviews.length})</p>
        </ul>

        <button className={styles['product-detail__favorite-button']} onClick={handleFavoriteClick}>
          <svg
            className={`${styles['product-detail__favorite-icon']} ${
              isFavorite ? styles['product-detail__favorite-icon--active'] : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={isFavorite ? '#FF0000' : '#5f6368'}
          >
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
          </svg>
          {isFavorite ? 'В избранном' : 'В избранное'}
        </button>
      </div>

      <div className={styles['product-detail__content']}>
        <div className={styles['product-detail__img-area']}>
          <img src={product.image} alt={product.name} />
        </div>

        <section className={styles['product-detail__features']}>
          <h2 className={styles['product-detail__features-title']}>Характеристики</h2>
          <ul className={styles['product-detail__features-list']}>{renderFeatures()}</ul>

          <section className={styles['product-detail__description']}>
            <h2 className={styles['product-detail__description-title']}>Описание</h2>
            <p
              className={`${styles['product-detail__description-text']} ${
                isExpanded ? styles['product-detail__description-text--expanded'] : ''
              }`}
            >
              {product.description}
            </p>
            <button
              className={styles['product-detail__description-toggle']}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Скрыть' : 'Показать полностью'}
            </button>
          </section>
        </section>

        <div className={styles['product-detail__price-block']}>
          <div className={styles['product-detail__price']}>
            {product.discount > 0 ? (
              <>
                <span className={styles['product-detail__price-old']}>
                  {product.price.toFixed(2)} ₸
                </span>
                <div className={styles['product-detail__price-current']}>
                  <span className={styles['product-detail__price-new']}>
                    {finalPrice.toFixed(2)} ₸
                  </span>
                  <span className={styles['product-detail__price-discount']}>
                    -{product.discount}%
                  </span>
                </div>
              </>
            ) : (
              <span className={styles['product-detail__price-new']}>
                {product.price.toFixed(2)} ₸
              </span>
            )}
          </div>

          <button className={styles['product-detail__buy-button']}>В корзину</button>
        </div>
      </div>
    </div>
  );
}
