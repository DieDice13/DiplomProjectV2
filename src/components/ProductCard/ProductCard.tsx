import { Link } from 'react-router-dom';
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
    addToCart(product, 1).catch(err => {
      console.error('Ошибка добавления в корзину', err);
    });
  };

  return (
    <div
      className={`relative flex h-[360px] flex-col w-full cursor-pointer rounded-lg p-5 transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      <Link to={`/product/${product.category.name}/${product.id}`} className="block w-full flex-1">
        {/* Изображение */}
        <div className="relative flex h-[160px] w-full items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full select-none object-contain"
            draggable={false}
          />
          {hasDiscount && (
            <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Иконка избранного */}
        <FavoriteIcon
          style={{ width: 24, height: 24 }}
          className={`absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer transition-transform duration-200 hover:scale-110 ${
            isFavorite ? 'fill-red-500' : 'fill-gray-400'
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

        {/* Контент */}
        <div className="flex flex-col px-4 mt-2 flex-1">
          <h3 className="text-left text-base font-bold text-gray-800 line-clamp-2 transition-colors duration-200 group-hover:text-blue-600">
            {product.name}
          </h3>

          <div className="mt-2">
            {hasDiscount ? (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {product.price.toFixed(2)} ₸
                </span>
                <span className="block text-lg font-bold text-black">{discountedPrice} ₸</span>
              </>
            ) : (
              <span className="text-lg font-bold text-black">От {product.price.toFixed(2)} ₸</span>
            )}
          </div>
        </div>
      </Link>

      {/* Кнопка корзины (фиксированное место) */}
      <div className="mt-2 flex h-[48px] w-full items-center justify-center px-4">
        {quantityInCart === 0 ? (
          <button onClick={handleAddToCart} className="cursor-pointer p-1">
            <AddToCartIcon className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="relative w-full rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-black transition-colors duration-200 hover:bg-blue-200"
          >
            +1 шт
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {quantityInCart}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
