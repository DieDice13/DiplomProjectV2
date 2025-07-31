import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeFromFavorites } from './favoritesSlice';
import styles from './Favorites.module.scss';
import ProductCard from '../../components/ProductCard/ProductCard';

const Favorites = () => {
  const favorites = useAppSelector(state => state.favorites.items);
  const dispatch = useAppDispatch();

  const handleRemove = (id: number) => {
    dispatch(removeFromFavorites(id));
  };

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
