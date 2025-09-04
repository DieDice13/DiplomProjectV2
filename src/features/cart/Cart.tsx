import React, { useMemo } from 'react';
import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../types/CartItem';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantityControlProps {
  item: CartItem;
  onChange: (delta: number) => void;
  onRemove: () => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ item, onChange, onRemove }) => (
  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-2">
    <button
      aria-label="Уменьшить количество товара"
      className="px-3 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition min-w-[36px]"
      onClick={() => onChange(-1)}
      disabled={item.quantity <= 1}
    >
      −
    </button>
    <span className="min-w-[28px] text-center font-medium text-base">{item.quantity}</span>
    <button
      aria-label="Увеличить количество товара"
      className="px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition min-w-[36px]"
      onClick={() => onChange(1)}
    >
      +
    </button>
    <button
      aria-label="Удалить товар из корзины"
      className="px-4 py-2 rounded-md bg-red-200 text-red-700 hover:bg-red-300 transition"
      onClick={onRemove}
    >
      Удалить
    </button>
  </div>
);

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, loading } = useCart();

  const { totalPrice, totalItems } = useMemo(() => {
    const totalPrice = cartItems.reduce(
      (sum, item) =>
        sum + (item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity,
      0,
    );
    return { totalPrice, totalItems: cartItems.length };
  }, [cartItems]);

  const formatPrice = (price: number) =>
    price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₸';

  if (loading) return <p className="p-4 text-gray-500 text-center">Загрузка корзины...</p>;

  return (
    <div className="py-4 min-h-[60vh] relative">
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">Ваша корзина</h1>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Список товаров или сообщение */}
        <div className="flex-1 min-w-[300px] flex flex-col justify-center">
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center py-20 lg:py-40">
              В вашей корзине пока нет товаров. Добавьте что-нибудь, чтобы оформить заказ.
            </p>
          ) : (
            <ul role="list" className="flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map(item => {
                  const finalPrice = item.discount
                    ? item.price * (1 - item.discount / 100)
                    : item.price;
                  return (
                    <motion.li
                      key={item.id}
                      role="listitem"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                      className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 border-b border-gray-200 bg-white rounded-md shadow-sm"
                    >
                      <Link
                        to={`/products/${item.category}/${item.id}`}
                        className="flex-shrink-0 mx-auto md:mx-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[160px] h-[160px] object-contain hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex flex-col gap-2 flex-grow text-center md:text-left">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">Цена: {formatPrice(finalPrice)}</p>

                        <QuantityControl
                          item={item}
                          onChange={delta => updateQuantity(item.id, item.quantity + delta)}
                          onRemove={() => removeFromCart(item.id)}
                        />
                      </div>

                      <div className="text-center md:text-right font-semibold text-lg mt-3 md:mt-0">
                        {formatPrice(finalPrice * item.quantity)}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Итог */}
        <div className="w-full lg:max-w-[320px] lg:sticky lg:top-4 self-start">
          <div
            role="region"
            aria-live="polite"
            className="bg-gray-100 rounded-lg p-6 shadow-sm flex flex-col gap-4 text-center lg:text-left"
          >
            <div className="text-lg">
              <strong>Итого:</strong> {formatPrice(totalPrice)}
            </div>
            <div className="text-lg">
              <strong>Товаров:</strong> {totalItems}
            </div>
            <button
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-md font-bold transition ${
                cartItems.length === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-[var(--site-selector)] text-white hover:bg-[var(--site-selector-hover)]'
              }`}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
