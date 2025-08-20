import { Link } from 'react-router-dom';
import styles from './CatalogNav.module.scss';

const categories = [
  { path: '/products/smartphones', label: 'Смартфоны' },
  { path: '/products/laptops', label: 'Ноутбуки' },
  { path: '/products/microwaves', label: 'Микроволновки' },
  { path: '/products/gaming_devices', label: 'Игровые устройства' },
  { path: '/products/televisions', label: 'Телевизоры' },
  { path: '/products/video_equipments', label: 'Видеооборудование' },
  { path: '/products/kitchen_appliances', label: 'Кухонная техника' },
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
