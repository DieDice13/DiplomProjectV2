import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProductCard from '../../components/ProductCard/ProductCard';
import { SortAndFilter } from './components/SortAndFilter';
import { useProductsByCategory } from '../../api/products';
import { useAttributesByCategory } from '../../api/filters';

import styles from './Catalog.module.scss';

import type { SortOption, SelectedFilters } from './components/types';
import type { Product } from '../../types/product';

const itemsPerPage = 12;

const Catalog = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [sort, setSort] = useState<SortOption | undefined>(undefined);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);

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

  const dbCategory = mapToDbCategory(category!);

  const normalizedFilters =
    Object.keys(selectedFilters).length > 0
      ? Object.fromEntries(
          Object.entries(selectedFilters).map(([key, set]) => [key, Array.from(set)]),
        )
      : undefined;

  const {
    products,
    totalCount,
    loading: loadingProducts,
    error: errorProducts,
  } = useProductsByCategory({
    category: dbCategory,
    page: currentPage,
    limit: itemsPerPage,
    filters: normalizedFilters,
    sort: sort,
  });

  const {
    attributes: availableFilters,
    loading: loadingFilters,
    error: errorFilters,
  } = useAttributesByCategory(dbCategory);

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

  if (loadingProducts || loadingFilters) return <p>Загрузка продуктов...</p>;

  if (errorProducts || errorFilters) {
    return (
      <div className={styles.catalog}>
        <p>Не удалось загрузить продукты. Попробуйте позже.</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className={styles.catalog}>По заданным параметрам ничего не найдено.</div>;
  }

  const sortProducts = (products: Product[], sort?: SortOption) => {
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
