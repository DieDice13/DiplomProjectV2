import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProductsByCategory } from '../../api/products';
import { getAttributesByCategory } from '../../api/filters';
import { SortAndFilter } from './components/SortAndFilter';

import styles from './Catalog.module.scss';

import type { Product } from '../../types/product';
import type {
  AttributeWithValues,
  SelectedFilters,
  SortOption,
  NormalizedFilters,
} from './components/types';

const itemsPerPage = 12;

const Catalog = () => {
  const { category } = useParams<{ category: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [availableFilters, setAvailableFilters] = useState<AttributeWithValues[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [sort, setSort] = useState<SortOption | undefined>(undefined);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const mapToDbCategory = (paramCategory: string) => {
    const map: Record<string, string> = {
      smartphones: 'smartphones',
      laptops: 'laptops',
      tv: 'tv',
      accessories: 'accessories',
    };
    return map[paramCategory] ?? paramCategory;
  };

  const transformCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      smartphones: 'Смартфоны',
      laptops: 'Ноутбуки',
      microwaves: 'Микроволновки',
      tablets: 'Планшеты',
      tvs: 'Телевизоры',
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const dbCategory = mapToDbCategory(category!);
        const fetchedFilters = await getAttributesByCategory(dbCategory);
        setAvailableFilters(fetchedFilters);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Ошибка при загрузке фильтров:', err.message, err);
        }
      }
    };

    fetchFilters();
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const dbCategory = mapToDbCategory(category!);

        const normalizedFilters: NormalizedFilters = Object.fromEntries(
          Object.entries(selectedFilters).map(([key, set]) => [key, Array.from(set)]),
        );

        const data = await getProductsByCategory(
          dbCategory,
          currentPage,
          itemsPerPage,
          Object.keys(normalizedFilters).length > 0 ? normalizedFilters : undefined,
          sort ?? undefined,
        );

        setProducts(data.items);
        setTotalCount(data.totalCount);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить продукты. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, selectedFilters, sort]);

  const handleFilterChange = (newFilters: SelectedFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(0);
  };

  const handleSortChange = (sort: SortOption | undefined) => {
    setSort(sort);
    setCurrentPage(0);
  };

  const handleToggleExpand = (param: string) => {
    setExpanded(prev => ({ ...prev, [param]: !prev[param] }));
  };

  if (loading) return <p>Загрузка продуктов...</p>;

  if (error) {
    return (
      <div className={styles.catalog}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className={styles.catalog}>По заданным параметрам ничего не найдено.</div>;
  }

  const sortProducts = (products: Product[], sort?: SortOption): Product[] => {
    return [...products].sort((a, b) => {
      const finalA = a.price * (1 - (a.discount ?? 0) / 100);
      const finalB = b.price * (1 - (b.discount ?? 0) / 100);

      switch (sort) {
        case 'PRICE_ASC':
          return finalA - finalB;
        case 'PRICE_DESC':
          return finalB - finalA;
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'NAME_DESC':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  return (
    <div className={styles.catalog}>
      <h2>Каталог: {transformCategoryName(category!)}</h2>

      <div className={styles.catalog__layout}>
        <main className={styles.catalog__content}>
          <div className={styles.catalog__productGrid}>
            {sortProducts(products, sort).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={Math.ceil(totalCount / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            forcePage={currentPage}
            containerClassName={styles.catalog__pagination}
            activeClassName={styles.catalog__paginationActive}
            previousClassName={styles.catalog__paginationBtn}
            nextClassName={styles.catalog__paginationBtn}
            disabledClassName={styles.catalog__paginationDisabled}
          />
        </main>

        <aside className={styles.catalog__sidebar}>
          <SortAndFilter
            filters={availableFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            selectedSort={sort}
            onSortChange={handleSortChange}
            expanded={expanded}
            onToggleExpand={handleToggleExpand}
          />
        </aside>
      </div>
    </div>
  );
};

export default Catalog;
