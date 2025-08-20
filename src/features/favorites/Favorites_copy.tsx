import { useFavorites } from '../../hooks/useFavorites';
import styles from './Favorites.module.scss';
import ProductCard from '../../components/ProductCard/ProductCard';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Избранное пусто</h2>
        <p>Добавьте товары в избранное, чтобы они отображались здесь.</p>
      </div>
    );
  }

  return (
    <div className={styles.favorites}>
      <h2>Избранное</h2>
      <div className={styles['favorites-grid']}>
        {favorites.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={() => toggleFavorite(product, true)} // передаем удаление
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
