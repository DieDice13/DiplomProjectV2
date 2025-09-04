import { useFavorites } from '../../hooks/useFavorites';
import ProductCard from '../../components/ProductCard/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col gap-5 py-10 text-center">
        <h2 className="text-2xl font-semibold">Избранное пусто</h2>
        <p>Добавьте товары в избранное, чтобы они отображались здесь.</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="mb-4 text-2xl font-semibold">Избранное ({favorites.length})</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
        <AnimatePresence>
          {favorites.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <ProductCard
                product={product}
                onToggleFavorite={() => toggleFavorite(product, true)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;
