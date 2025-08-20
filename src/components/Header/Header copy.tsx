import { Link, useNavigate } from 'react-router-dom';
import CatalogNav from '../CatalogNav/CatalogNav';
import Container from '../Container/Container';
import { useAppSelector } from '../../hooks/useAppSelector';
import SupportBar from '../SupportBar/SupportBar';

const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  const handleProfileClick = () => {
    navigate(user ? '/profile' : '/auth');
  };

  return (
    <header className="relative">
      {/* Топбар над шапкой */}
      <SupportBar />

      <Container>
        <div
          className="
            relative grid items-center gap-6
            grid-cols-[auto_auto_1fr_auto] py-4
          "
        >
          {/* Логотип */}
          <Link
            to="/"
            className="text-[28px] font-bold text-[var(--site-selector)] hover:text-[var(--site-selector-hover)] transition-colors"
          >
            TECHDICE
          </Link>

          {/* Каталог */}
          <button
            aria-label="Открыть каталог"
            className="
              group flex items-center rounded border px-7 py-2.5
              border-[var(--site-selector)] text-[var(--site-selector)]
              transition-colors duration-300 hover:bg-[var(--site-selector)]
              hover:text-white
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-4 h-6 w-6 stroke-current"
              strokeWidth={1.5}
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
            <span className="hidden sm:inline">Каталог</span>
          </button>

          {/* Поиск */}
          <form
            role="search"
            className="flex h-12 border border-neutral-200 rounded focus-within:border-black"
          >
            <input
              type="text"
              placeholder="Поиск"
              aria-label="Поиск"
              className="flex-grow px-3 py-2 border-0 focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Найти"
              className="group flex items-center justify-center px-3 rounded-r transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 group-hover:text-[var(--site-selector-hover)]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>
          </form>

          {/* Действия */}
          <nav className="flex gap-5 text-[var(--text-color)]">
            {/* Профиль */}
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Профиль"
              className="group flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-9 w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-8 w-8 text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]"
                  fill="currentColor"
                >
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                </svg>
              </div>
              <span className="hidden md:inline text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]">
                Профиль
              </span>
            </button>

            {/* Избранное */}
            <Link
              to="/favorites"
              aria-label="Избранное"
              className="group flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-6 w-6 text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]"
                  fill="currentColor"
                >
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
              </div>
              <span className="hidden md:inline text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]">
                Избранное
              </span>
            </Link>

            {/* Корзина */}
            <Link to="/cart" aria-label="Корзина" className="group flex flex-col items-center">
              <div className="flex items-center justify-center h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-6 w-6 text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]"
                  fill="currentColor"
                >
                  <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40в-80h130l38 80Zm134 280h280-280Z" />
                </svg>
              </div>
              <span className="hidden md:inline text-gray-500 transition-colors duration-200 group-hover:text-[var(--site-selector-hover)]">
                Корзина
              </span>
            </Link>
          </nav>
        </div>

        {/* Каталог под шапкой */}
        <CatalogNav />
      </Container>
    </header>
  );
};

export default Header;
