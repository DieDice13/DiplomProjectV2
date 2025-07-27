import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import styles from './ProductCard.module.scss';
import FavoriteIcon from '../../assets/icons/favorite-svgrepo-com.svg?react';
import AddToCartIcon from '../../assets/icons/add-to-cart-svgrepo-com.svg?react';

type ProductCardProps = {
  product: Product;
  className?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: number) => void;
  inCart?: boolean;
  onAddToCart?: (product: Product) => void;
  quantity?: number;
  onQuantityChange?: (id: number, quantity: number) => void;
};

export const ProductCard = ({
  product,
  className = '',
  inCart = false,
  onAddToCart,
  quantity = 1,
  onQuantityChange,
  isFavorite = false,
}: ProductCardProps) => {
  const hasDiscount = !!product.discount;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount! / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuantityChange = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange?.(product.id, Math.max(1, quantity + delta));
  };

  return (
    <div className={`${styles['product-card']} ${className}`}>
      <Link
        to={`/product/${product.category.name}/${product.id}`}
        className={styles['product-card__link']}
      >
        <div className={styles['product-card__image-container']}>
          <img src={product.image} alt={product.name} className={styles['product-card__image']} />
          {hasDiscount && (
            <div className={styles['product-card__discount']}>-{product.discount}%</div>
          )}
        </div>

        <FavoriteIcon
          className={isFavorite ? styles['favorite-icon--active'] : styles['favorite-icon']}
          aria-label="Добавить в избранное"
        />

        <div className={styles['product-card__content']}>
          <h3 className={styles['product-card__title']}>{product.name}</h3>

          <div className={styles['product-card__price']}>
            {hasDiscount ? (
              <>
                <span className={styles['price-old']}>{product.price.toFixed(2)}&nbsp;₸</span>
                <span className={styles['price-new']}>{discountedPrice}&nbsp;₸</span>
              </>
            ) : (
              <span className={styles['price-regular']}>От {product.price.toFixed(2)}&nbsp;₸</span>
            )}
          </div>
        </div>
      </Link>

      <div className={styles['product-card__quantity']}>
        {inCart ? (
          <>
            <button onClick={handleQuantityChange(-1)}>-</button>
            <span>{quantity}</span>
            <button onClick={handleQuantityChange(1)}>+</button>
          </>
        ) : (
          <button className={styles['add-to-cart-btn']} onClick={handleAddToCart}>
            <AddToCartIcon className={styles['cart-icon']} aria-label="Добавить в корзину" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
