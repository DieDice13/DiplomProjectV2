import { Link } from 'react-router-dom';
import styles from './CatalogNav.module.scss';

const CatalogNav = () => {
  return (
    <div className={styles.catalog_nav}>
      <Link to="/products/smartphones">Смартфоны</Link>
      <Link to="/products/laptops">Ноутбуки</Link>
      <Link to="/products/microwaves">Микроволновки</Link>
      <Link to="/products/tablets">Планшеты</Link>
    </div>
  );
};

export default CatalogNav;
