import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import FavoriteIcon from '../../assets/icons/favorite-svgrepo-com.svg?react';
import AddToCartIcon from '../../assets/icons/add-to-cart-svgrepo-com.svg?react';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types/product';

type ProductCardProps = {
  product: Product;
  className?: string;
  onToggleFavorite?: () => void;
};

export const ProductCard = ({ product, className = '', onToggleFavorite }: ProductCardProps) => {
  const { cartItems, addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some((f: { id: number }) => f.id === product.id);

  // Количество в корзине
  const quantityInCart = cartItems.find(item => item.product.id === product.id)?.quantity ?? 0;

  const hasDiscount = !!product.discount;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount! / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Передаём весь объект product — useCart сделает оптимистичный апдейт и отправит mutation
    addToCart(product, 1).catch(err => {
      console.error('Ошибка добавления в корзину', err);
    });
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
          style={{ width: 24, height: 24 }}
          className={`${styles['favorite-icon']} ${
            isFavorite ? styles['favorite-icon--active'] : ''
          }`}
          aria-label="Добавить в избранное"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite();
            } else {
              toggleFavorite(product, isFavorite);
            }
          }}
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

      <div className={styles['product-card__cart-button-container']}>
        {quantityInCart === 0 ? (
          <button className={styles['add-to-cart-btn']} onClick={handleAddToCart}>
            <AddToCartIcon className={styles['cart-icon']} aria-label="Добавить в корзину" />
          </button>
        ) : (
          <button className={styles['added-btn']} onClick={handleAddToCart}>
            +1 шт
            <span className={styles['added-btn__quantity']}>{quantityInCart}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
