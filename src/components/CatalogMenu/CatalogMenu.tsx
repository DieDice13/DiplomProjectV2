import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useMediaQuery from '../../hooks/useMediaQuery';
import { categories } from './categories';
import type { Category } from './categories';

// Props для блока категории
interface CategoryBlockProps extends Category {
  isMobile?: boolean;
  onClose?: () => void;
}

// Props для всего меню каталога
interface CatalogMenuProps {
  onClose: () => void;
}

const CatalogMenu = ({ onClose }: CatalogMenuProps) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isOpen, setIsOpen] = useState(false);

  // Эффект для мобильной версии: блокировка скролла страницы
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsOpen(true), 10);
      return () => {
        document.body.style.overflow = '';
        setIsOpen(false);
      };
    }
  }, [isMobile]);

  return (
    <div
      className={
        isMobile
          ? `fixed inset-0 z-50 flex transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'absolute left-0 top-full w-full bg-white border-t shadow-lg z-50 max-h-[80vh] overflow-y-auto'
      }
    >
      {/* Мобильная версия меню */}
      {isMobile && (
        <div className="w-full h-full bg-white flex flex-col shadow-xl">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Каталог</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10">
            {categories.map(({ id, label, image, subCategories }) => (
              <CategoryBlock
                key={id}
                id={id}
                label={label}
                image={image}
                subCategories={subCategories}
                isMobile
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      )}

      {/* Десктопная версия меню */}
      {!isMobile && (
        <div className="w-full bg-white">
          <div className="mx-auto w-full max-w-[1440px] px-[15px] sm:px-[40px] py-6 lg:py-12">
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map(({ id, label, image, subCategories }) => (
                <CategoryBlock
                  key={id}
                  id={id}
                  label={label}
                  image={image}
                  subCategories={subCategories}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент отдельной категории
const CategoryBlock = ({
  id,
  label,
  image,
  subCategories,
  isMobile,
  onClose,
}: CategoryBlockProps & { isMobile?: boolean }) => {
  const categoryPath = `/products/${id}`;
  const [showAll, setShowAll] = useState(false);

  const visibleSubCategories = isMobile || showAll ? subCategories : subCategories.slice(0, 5);

  return (
    <div className={`flex flex-col ${isMobile ? 'items-center text-center' : ''}`}>
      {/* Ссылка на категорию */}
      <Link
        to={categoryPath}
        onClick={onClose}
        className={`relative flex items-center ${isMobile ? 'flex-col' : 'group'}`}
      >
        <div
          className={`${
            isMobile ? 'w-20 h-20' : 'relative w-28 h-28 overflow-hidden rounded-md flex-shrink-0'
          }`}
        >
          <img src={image} alt={label} loading="lazy" className="w-full h-full object-contain" />
        </div>

        <span
          className={`font-semibold text-gray-800 leading-snug ${
            isMobile
              ? 'text-base mt-2 cursor-default'
              : 'text-sm md:text-base ml-2 relative z-10 group-hover:text-[var(--site-selector-hover)] cursor-pointer transition-colors'
          }`}
        >
          {label}
        </span>
      </Link>

      {/* Список подкатегорий */}
      <ul className="flex flex-col gap-2 text-gray-700 text-sm md:text-base mt-2">
        {visibleSubCategories.map(sub => (
          <li key={sub.path}>
            <Link
              to={sub.path}
              onClick={onClose}
              className="hover:text-[var(--site-selector-hover)] transition-colors cursor-pointer"
            >
              {sub.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Кнопка "Показать все" (только десктоп) */}
      {!isMobile && subCategories.length > 5 && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className="mt-2 text-[var(--site-selector)] text-sm font-medium hover:underline self-start"
        >
          {showAll ? 'Скрыть' : 'Показать все'}
        </button>
      )}
    </div>
  );
};

export default CatalogMenu;
