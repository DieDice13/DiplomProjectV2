import styles from './PopularBrands.module.scss'; // <-- модули
// import { Pagination } from 'swiper/modules';
import { brandImages } from './brands.data'; // Импортируем данные брендов

const PopularBrands = () => {
  return (
    <section className={`${styles.brands} container`}>
      <h3 className={styles['brands-title']}>Популярные бренды</h3>

      {/* Контейнер для скролла на мобильных */}
      <div className={styles['brands-scroll-wrapper']}>
        <div className={styles['brands-grid']}>
          {brandImages.map(brand => (
            <div key={brand.id} className={styles.item}>
              <img src={brand.src} alt={brand.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
