import { useCart } from '../../hooks/useCart';
import { Link } from 'react-router-dom';
import styles from './Cart.module.scss';
import type { CartItem } from '../../types/CartItem';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, loading } = useCart();

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = cartItems.find((item: CartItem) => item.id === productId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const getFinalPrice = (price: number, discount?: number) =>
    discount ? price * (1 - discount / 100) : price;

  const total = cartItems.reduce(
    (sum: number, item: CartItem) => sum + getFinalPrice(item.price, item.discount) * item.quantity,
    0,
  );

  if (loading) {
    return <p>Загрузка корзины...</p>;
  }

  return (
    <div className={styles.cart}>
      <h2>Корзина</h2>

      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста.</p>
      ) : (
        <div className={styles['cart-content']}>
          <div className={styles['cart-items']}>
            <ul className={styles['cart-list']}>
              {cartItems.map((item: CartItem) => (
                <li className={styles.item} key={item.id}>
                  <Link to={`/product/${item.category}/${item.id}`}>
                    <img src={item.image} alt={item.name} className={styles.image} />
                  </Link>
                  <div className={styles.info}>
                    <h3 className={styles.title}>{item.name}</h3>
                    <p className={styles.price}>
                      Цена: {getFinalPrice(item.price, item.discount).toFixed(2)} ₸
                    </p>

                    <div className={styles.controls}>
                      <button
                        className={styles.decrease}
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className={styles.increase}
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </button>
                      <button className={styles.remove} onClick={() => handleRemove(item.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                  <div className={styles.final}>
                    {(getFinalPrice(item.price, item.discount) * item.quantity).toFixed(2)} ₸
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles['cart-summary']}>
            <div className={styles.summary}>
              <div className={styles.total}>
                <strong>Итого:</strong> {total.toFixed(2)} ₸
              </div>
              <div className={styles.count}>
                <strong>Товаров:</strong> {cartItems.length}
              </div>
              <button className={styles.checkout}>Оформить заказ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
