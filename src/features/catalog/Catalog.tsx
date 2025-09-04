import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard/ProductCard';
import { SortAndFilter, SortControl } from './components/SortAndFilter';
import { useProductsByCategory } from '../../api/products';
import { useAttributesByCategory } from '../../api/filters';

import type { SortOption, SelectedFilters } from './components/types';
import type { Product } from '../../types/product';

const itemsPerPage = 12;

const Catalog = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [sort, setSort] = useState<SortOption | undefined>(undefined);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const transformCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      smartphones: 'Смартфоны',
      laptops: 'Ноутбуки',
      microwaves: 'Микроволновки',
      gaming_devices: 'Игровые девайсы',
      televisions: 'Телевизоры',
      video_equipments: 'Видеооборудование',
      kitchen_appliances: 'Кухонные приборы',
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  useEffect(() => setCurrentPage(0), [category]);

  const dbCategory = category ?? '';

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
    sort,
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

  if (loadingProducts || loadingFilters) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: itemsPerPage }).map((_, idx) => (
          <div key={idx} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (errorProducts || errorFilters)
    return (
      <div className="flex flex-col gap-4 p-4">
        <p>Не удалось загрузить продукты. Попробуйте позже.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );

  if (products.length === 0)
    return <p className="p-4 text-center">По заданным параметрам ничего не найдено.</p>;

  const sortProducts = (products: Product[], sort?: SortOption) =>
    [...products].sort((a, b) => {
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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mt-4 text-2xl font-semibold">{transformCategoryName(category!)}</h1>

      {/* Сортировка + кнопка фильтров (мобилка) */}
      <div className="flex lg:hidden gap-4">
        <div className="flex-1">
          <SortControl selectedSort={sort} onChange={handleSortChange} />
        </div>
        <div className="w-28">
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Фильтры
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <main className="flex-[3] flex flex-col w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {sortProducts(products, sort).map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            pageCount={Math.ceil(totalCount / itemsPerPage)}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            forcePage={currentPage}
            containerClassName="flex flex-wrap justify-center gap-2 mt-8 mb-5 list-none p-0"
            pageClassName="min-w-[40px] h-10 border border-gray-300 rounded-md flex items-center justify-center transition-colors cursor-pointer text-[var(--site-selector)] hover:bg-[var(--site-selector-hover)] hover:text-white"
            activeClassName="!bg-[var(--site-selector)] !text-white font-bold"
            previousClassName="min-w-[40px] h-10 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer text-[var(--site-selector)] hover:bg-[var(--site-selector-hover)] hover:text-white"
            nextClassName="min-w-[40px] h-10 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer text-[var(--site-selector)] hover:bg-[var(--site-selector-hover)] hover:text-white"
            disabledClassName="!text-gray-400 !border-gray-200 !cursor-not-allowed !opacity-50 hover:!bg-transparent hover:!text-gray-400 hover:!opacity-50"
            pageLinkClassName="w-full h-full flex items-center justify-center"
            previousLinkClassName="w-full h-full flex items-center justify-center"
            nextLinkClassName="w-full h-full flex items-center justify-center"
          />
        </main>

        <aside className="hidden lg:block flex-1 max-w-[300px] w-full">
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

      {/* Off-canvas фильтры (mobile) с анимацией */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex-1 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <motion.div
              className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button className="mb-4 text-sm text-gray-600" onClick={() => setFiltersOpen(false)}>
                ✕ Закрыть
              </button>
              <SortAndFilter
                filters={availableFilters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                selectedSort={sort}
                onSortChange={handleSortChange}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;
