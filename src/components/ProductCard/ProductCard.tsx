import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
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
  const quantityInCart = cartItems.find(item => item.product.id === product.id)?.quantity ?? 0;

  const hasDiscount = product.discount !== undefined && product.discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1).catch(err => console.error('Ошибка добавления в корзину', err));
  };

  return (
    <div
      className={`relative flex flex-col w-full rounded-lg bg-white p-3 shadow-md transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* бейджик скидки */}
      {hasDiscount && (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-1 py-0.5 text-[10px] font-bold text-white shadow-md">
          -{product.discount}%
        </div>
      )}

      {/* иконка избранного */}
      <div className="absolute right-2 top-2 z-10">
        <Heart
          className={`h-5 w-5 cursor-pointer transition-transform duration-200 hover:scale-110 ${
            isFavorite ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite();
            else toggleFavorite(product, isFavorite);
          }}
        />
      </div>

      {/* Ссылка на страницу товара */}
      <Link to={`/product/${product.category.name}/${product.id}`} className="flex flex-col flex-1">
        {/* изображение товара */}
        <div className="flex items-center justify-center h-[160px] w-full overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">
              Нет изображения
            </div>
          )}
        </div>

        {/* название товара */}
        <h3 className="mt-2 text-center text-xs font-medium text-gray-800 line-clamp-2 min-h-[36px]">
          {product.name}
        </h3>

        {/* цены */}
        <div className="mt-1 text-center min-h-[40px] flex flex-col justify-center">
          <span
            className={`block text-xs line-through ${hasDiscount ? 'text-gray-400' : 'invisible'}`}
          >
            {product.price.toLocaleString('ru-RU')} ₸
          </span>
          <span className="block text-base font-bold text-[var(--site-selector)]">
            {finalPrice.toLocaleString('ru-RU')} ₸
          </span>
        </div>
      </Link>

      {/* кнопка добавления в корзину */}
      <div className="mt-2 flex justify-center min-h-[36px]">
        {quantityInCart === 0 ? (
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-16 items-center justify-center rounded-md transition"
            style={{ backgroundColor: 'var(--site-selector)', color: 'white' }}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="relative flex h-9 w-16 items-center justify-center rounded-md text-xs font-medium transition"
            style={{ backgroundColor: 'var(--site-selector)', color: 'white' }}
          >
            +1
            <span
              className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shadow"
              style={{ backgroundColor: 'var(--site-selector-hover)', color: 'white' }}
            >
              {quantityInCart}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
