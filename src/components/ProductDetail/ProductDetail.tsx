import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../../graphql/queries/product';
import { GET_ATTRIBUTES_BY_CATEGORY } from '../../graphql/queries/filters';
import Reviews from '../../features/reviews/Reviews';
import { GET_REVIEWS_BY_PRODUCT } from '../../graphql/queries/reviews';
import { useFavorites } from '../../hooks/useFavorites';
import type { Product } from '../../types/product'; // ✅ новый единый тип
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

// Типы для характеристик и отзывов
type Attribute = { key: string; label: string };
type Review = { id: string; rating: number; comment?: string };

export default function ProductDetail() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  // Преобразуем id в число
  const productIdInt = id && /^\d+$/.test(id) ? parseInt(id, 10) : undefined;

  // --- Запрос данных товара ---
  const {
    data: productData,
    loading: loadingProduct,
    error: errorProduct,
  } = useQuery<{ product: Product }>(GET_PRODUCT_BY_ID, {
    variables: { id: productIdInt ?? 0 },
    skip: !productIdInt,
  });

  // --- Запрос характеристик для категории ---
  const {
    data: attributesData,
    loading: loadingAttributes,
    error: errorAttributes,
  } = useQuery<{ attributes: Attribute[] }>(GET_ATTRIBUTES_BY_CATEGORY, {
    variables: { category: category ?? '' },
    skip: !category,
  });

  // --- Запрос отзывов ---
  const {
    // data: reviewsData,
    loading: loadingReviews,
    error: errorReviews,
  } = useQuery<{ reviewsByProduct: Review[] }>(GET_REVIEWS_BY_PRODUCT, {
    variables: { productId: productIdInt ?? 0 },
    skip: !productIdInt,
  });

  // --- Лоадеры и обработка ошибок ---
  if (loadingProduct || loadingAttributes || loadingReviews) return <div>Загрузка...</div>;
  if (errorProduct || errorAttributes || errorReviews) return <div>Ошибка при загрузке данных</div>;

  const product = productData?.product;
  const attributes = attributesData?.attributes ?? [];
  // const reviews = reviewsData?.reviewsByProduct ?? [];

  if (!product) return <div>Товар не найден</div>;

  // --- Расчет цены и скидки ---
  const discount = product.discount ?? 0;
  const finalPrice = product.price * (1 - discount / 100);

  // --- Избранное ---
  const isFavorite = favorites.some(f => f.id === Number(product.id));
  const handleFavoriteClick = () => toggleFavorite(product, isFavorite);

  // --- Корзина ---
  const cartItem = cartItems.find(i => i.id === String(product.id));
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!cartItem) addToCart(product, 1);
    else updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleRemove = () => {
    if (!cartItem) return;
    if (cartItem.quantity > 1) updateQuantity(cartItem.id, cartItem.quantity - 1);
    else removeFromCart(cartItem.id);
  };

  // --- Функция рендеринга характеристик ---
  const renderFeatures = () =>
    attributes.map(attr => {
      const value = product.features?.[attr.key];
      return value ? (
        <li key={attr.key} className="text-gray-700">
          <span className="font-semibold text-gray-500">{attr.label}:</span> {value}
        </li>
      ) : null;
    });

  // --- Кнопка добавления в корзину ---
  const CartButton = () => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full rounded-md overflow-hidden bg-[var(--site-selector)] text-white font-medium">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3.5 text-base transition-colors"
            >
              В корзину <ShoppingCart size={20} />
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleRemove}
                className="px-4 py-2.5 sm:py-3.5 text-lg font-bold hover:bg-[var(--site-selector-hover)]"
              >
                −
              </button>
              <span className="flex-1 text-center text-sm sm:text-base">
                В корзине: <strong>{quantity}</strong> шт
              </span>
              <button
                onClick={handleAdd}
                className="px-4 py-2.5 sm:py-3.5 text-lg font-bold hover:bg-[var(--site-selector-hover)]"
              >
                +
              </button>
            </div>
          )}
        </div>

        {quantity > 0 && (
          <Link to="/cart" className="text-center text-sm text-blue-600 hover:underline">
            Перейти в корзину
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-white flex flex-col gap-6">
      {/* Название товара и управление избранным */}
      <div className="flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
        <div className="flex items-center justify-start gap-3 border-b border-gray-300 pb-2">
          <button
            onClick={handleFavoriteClick}
            className="flex items-center gap-1 text-sm sm:text-base cursor-pointer select-none"
          >
            <Heart
              size={20}
              className={`transition-transform duration-200 ${
                isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            />
            <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
          </button>
        </div>
      </div>

      {/* Основной блок: фото + характеристики + цена */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-6">
        {/* Фото товара */}
        <div className="flex justify-center items-center min-w-0 shrink">
          <div className="h-[260px] sm:h-[500px] lg:h-[520px] w-full flex justify-center items-center">
            <img src={product.image ?? ''} alt={product.name} className="h-full object-contain" />
          </div>
        </div>

        {/* Характеристики и описание */}
        <div className="flex flex-col gap-6 mt-4 lg:mt-0 px-0 lg:px-4 min-w-0 shrink">
          <section className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Характеристики</h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">{renderFeatures()}</ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Описание</h2>
            <p className={`text-gray-700 text-sm sm:text-base ${isExpanded ? '' : 'line-clamp-3'}`}>
              {product.description}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[var(--site-selector)] font-medium hover:underline self-start text-sm sm:text-base"
            >
              {isExpanded ? 'Скрыть' : 'Показать полностью'}
            </button>
          </section>
        </div>

        {/* Цена и кнопка корзины */}
        <div className="border border-gray-300 p-5 flex flex-col gap-5 mt-4 lg:mt-0 w-full lg:w-auto lg:min-w-[220px] lg:max-w-[300px] self-start">
          <div className="flex flex-col gap-3">
            {discount > 0 ? (
              <>
                <span className="line-through text-gray-500 text-base sm:text-lg">
                  {product.price.toLocaleString('ru-RU')} ₸
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[var(--site-selector)]">
                    {finalPrice.toLocaleString('ru-RU')} ₸
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1.5 rounded">
                    -{discount}%
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-[var(--site-selector)]">
                {product.price.toLocaleString('ru-RU')} ₸
              </span>
            )}
          </div>

          {/* Кнопка добавления/редактирования корзины */}
          <CartButton />
        </div>
      </div>

      {/* Отзывы */}
      <Reviews productId={product.id} />
    </div>
  );
}
