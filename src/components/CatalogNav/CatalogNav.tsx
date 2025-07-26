import { Link } from 'react-router-dom';
import styles from './CatalogNav.module.scss';

const categories = [
  { path: '/products/smartphones', label: 'Смартфоны' },
  { path: '/products/laptops', label: 'Ноутбуки' },
  { path: '/products/microwaves', label: 'Микроволновки' },
  { path: '/products/tablets', label: 'Планшеты' },
  { path: '/products/fridges', label: 'Холодильники' },
  { path: '/products/tvs', label: 'Телевизоры' },
  { path: '/products/headphones', label: 'Наушники' },
  // добавь сколько угодно
];

const CatalogNav = () => {
  return (
    <div className={styles.catalog_nav}>
      <div className={styles.catalog_track}>
        {categories.map(({ path, label }) => (
          <Link key={path} to={path} className={styles.catalog_link}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CatalogNav;
