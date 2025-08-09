import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import styles from './ProductCard.module.scss';
import FavoriteIcon from '../../assets/icons/favorite-svgrepo-com.svg?react';
import AddToCartIcon from '../../assets/icons/add-to-cart-svgrepo-com.svg?react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addToCart } from '../../features/cart/cartSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useFavorites } from '../../hooks/useFavorites';

type ProductCardProps = {
  product: Product;
  className?: string;
  onToggleFavorite?: () => void;
};

export const ProductCard = ({ product, className = '', onToggleFavorite }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(state => state.cart.items);
  const cartItem = cartItems.find(item => item.id === product.id.toString());
  const quantityInCart = cartItem?.quantity ?? 0;

  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((f: { id: number }) => f.id === product.id);

  const hasDiscount = !!product.discount;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discount! / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const finalPrice = product.price * (1 - (product.discount ?? 0) / 100);

    dispatch(
      addToCart({
        id: product.id.toString(),
        name: product.name,
        image: product.image,
        price: finalPrice,
        discount: product.discount ?? 0,
        category: product.category.name,
        quantity: 1,
      }),
    );
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
