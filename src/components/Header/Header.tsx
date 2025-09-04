import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';

import CatalogNav from '../CatalogNav/CatalogNav';
import Container from '../Container/Container';
import SupportBar from '../SupportBar/SupportBar';
import CatalogMenu from '../CatalogMenu/CatalogMenu';

import { User, Heart, ShoppingCart, Menu, Search } from 'lucide-react';

// 🔹 Компонент иконки с бейджем
const IconWithBadge = ({
  count,
  children,
  small = false,
}: {
  count?: number;
  children: React.ReactNode;
  small?: boolean;
}) => (
  <div className="relative flex items-center justify-center">
    {children}
    {typeof count === 'number' && count > 0 && (
      <span
        className={`absolute -top-1 -right-1 bg-[var(--site-selector)] text-white rounded-full flex items-center justify-center ${
          small ? 'text-[10px] w-4 h-4' : 'text-xs w-4 h-4'
        }`}
      >
        {count}
      </span>
    )}
  </div>
);

// 🔹 Компонент поиска
const SearchForm = ({ small = false }: { small?: boolean }) => (
  <form
    role="search"
    className={`flex border border-neutral-200 rounded focus-within:border-black flex-grow ${
      small ? 'h-11' : 'h-12'
    }`}
  >
    <input
      type="text"
      placeholder="Поиск"
      aria-label="Поиск"
      className="flex-grow px-2 py-2 border-0 focus:outline-none"
    />
    <button
      type="submit"
      aria-label="Найти"
      className="group flex items-center justify-center px-2 sm:px-3"
    >
      <Search
        className={`${
          small ? 'h-5 w-5' : 'h-6 w-6'
        } text-gray-600 group-hover:text-[var(--site-selector-hover)]`}
        strokeWidth={1.5}
      />
    </button>
  </form>
);

// 🔹 Кнопка каталога
const CatalogButton = ({
  isOpen,
  toggle,
  small = false,
}: {
  isOpen: boolean;
  toggle: () => void;
  small?: boolean;
}) => (
  <button
    aria-label={isOpen ? 'Закрыть каталог' : 'Открыть каталог'}
    onClick={toggle}
    className={`relative z-50 group flex items-center rounded text-white transition duration-200 hover:bg-[var(--site-selector-hover)] ${
      small ? 'p-2 bg-[var(--site-selector)]' : 'px-7 py-2.5 bg-[var(--site-selector)]'
    }`}
  >
    {isOpen ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${small ? 'h-6 w-6' : 'h-6 w-6 mr-4'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <Menu
        className={`${small ? 'h-6 w-6' : 'h-6 w-6 mr-4'} stroke-current text-white`}
        strokeWidth={1.5}
      />
    )}
    {!small && <span className="hidden sm:inline">Каталог</span>}
  </button>
);

const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const cartItems = useAppSelector(state => state.cart.items);
  const favoritesItems = useAppSelector(state => state.favorites.items || []);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favoritesItems.length;

  const handleProfileClick = () => {
    navigate(user ? '/profile' : '/auth');
  };

  return (
    <header className="relative">
      <SupportBar />
      <Container>
        {/* Десктоп ≥768px */}
        <div className="relative grid items-center gap-3 md:gap-4 lg:gap-6 grid-cols-[auto_auto_minmax(0,1fr)_auto] py-4 max-md:hidden">
          <Link
            to="/"
            className="text-[28px] font-bold text-[var(--site-selector)] hover:text-[var(--site-selector-hover)] transition-colors"
          >
            TECHDICE
          </Link>

          <CatalogButton isOpen={isCatalogOpen} toggle={() => setIsCatalogOpen(p => !p)} />

          {/* 🔹 фикс: обернули SearchForm в min-w-0 */}
          <div className="min-w-0">
            <SearchForm />
          </div>

          <nav className="flex gap-2 md:gap-2 lg:gap-5 text-[var(--text-color)]">
            {/* Профиль */}
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Профиль"
              className="group flex flex-col items-center"
            >
              <IconWithBadge>
                <User className="h-7 w-7 text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]" />
              </IconWithBadge>
              <span className="hidden lg:inline text-gray-500 group-hover:text-[var(--site-selector-hover)]">
                Профиль
              </span>
            </button>

            {/* Избранное */}
            <Link
              to="/favorites"
              aria-label="Избранное"
              className="group flex flex-col items-center"
            >
              <IconWithBadge count={favoritesCount}>
                <Heart className="h-7 w-7 text-gray-500 group-hover:text-[var(--site-selector-hover)]" />
              </IconWithBadge>
              <span className="hidden lg:inline text-gray-500 group-hover:text-[var(--site-selector-hover)]">
                Избранное
              </span>
            </Link>

            {/* Корзина */}
            <Link to="/cart" aria-label="Корзина" className="group flex flex-col items-center">
              <IconWithBadge count={cartCount}>
                <ShoppingCart className="h-7 w-7 text-gray-500 group-hover:text-[var(--site-selector-hover)]" />
              </IconWithBadge>
              <span className="hidden lg:inline text-gray-500 group-hover:text-[var(--site-selector-hover)]">
                Корзина
              </span>
            </Link>
          </nav>
        </div>

        {/* Мобильная версия <768px */}
        <div className="md:hidden flex flex-col gap-3 py-3">
          <div className="flex items-center justify-between">
            <button onClick={handleProfileClick} aria-label="Профиль">
              <User className="h-8 w-8 text-gray-500 hover:text-[var(--site-selector-hover)]" />
            </button>

            <Link
              to="/"
              className="text-xl font-bold text-[var(--site-selector)] hover:text-[var(--site-selector-hover)] transition-colors"
            >
              TECHDICE
            </Link>

            <div className="flex gap-4">
              <Link to="/favorites" aria-label="Избранное">
                <IconWithBadge count={favoritesCount} small>
                  <Heart className="h-6 w-6 text-gray-500 hover:text-[var(--site-selector-hover)]" />
                </IconWithBadge>
              </Link>
              <Link to="/cart" aria-label="Корзина">
                <IconWithBadge count={cartCount} small>
                  <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-[var(--site-selector-hover)]" />
                </IconWithBadge>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CatalogButton isOpen={isCatalogOpen} toggle={() => setIsCatalogOpen(p => !p)} small />
            <SearchForm small />
          </div>
        </div>

        {isCatalogOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsCatalogOpen(false)}
            />
            <CatalogMenu onClose={() => setIsCatalogOpen(false)} />
          </>
        )}

        <CatalogNav />
      </Container>
    </header>
  );
};

export default Header;
