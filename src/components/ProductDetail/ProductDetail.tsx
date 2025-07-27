import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGraphQL } from '../../api/graphqlClient';
import styles from './ProductDetail.module.scss';

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

const GET_PRODUCT_BY_ID = `
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      price
      discount
      image
      description
      category {
        name
      }
      features
    }
  }
`;

const GET_ATTRIBUTES_BY_CATEGORY = `
  query GetAttributesByCategory($category: String!) {
    attributes(category: $category) {
      key
      label
    }
  }
`;

export default function ProductDetail() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!id || !category) return;

    const fetchData = async () => {
      try {
        const [productRes, attributesRes] = await Promise.all([
          fetchGraphQL<{ product: Product }>(GET_PRODUCT_BY_ID, { id }),
          fetchGraphQL<{ attributes: Attribute[] }>(GET_ATTRIBUTES_BY_CATEGORY, { category }),
        ]);
        setProduct(productRes.product);
        setAttributes(attributesRes.attributes);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, category]);

  if (loading || !product) return <div>Загрузка...</div>;

  const finalPrice = product.price * (1 - product.discount / 100);

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
