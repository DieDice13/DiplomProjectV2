import { Link } from 'react-router-dom';
import styles from './ShowCase.module.scss';

const ShowCase = () => {
  return (
    <section className={styles['category-showcase']}>
      <div className={styles['category-showcase__container']}>
        <div
          className={`${styles['category-showcase__item']} ${styles['category-showcase__item--large']}`}
        >
          <Link to="/products/microwaves">
            <img
              src="https://static.insales-cdn.com/r/mtbEwBAC41c/rs:fill-down:549:344:1/q:100/plain/files/1/5894/16365318/original/Component_5-5-min.jpg@jpg"
              alt="Стиральная машина"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/gaming_devices">
            <img
              src="https://static.insales-cdn.com/r/DWWbtp6QVt4/rs:fill-down:262:164:1/q:100/plain/files/1/5322/16364746/original/Component_5-3_143e82bedd6e26ac5f9ec8ec65aeb4cd.jpg@jpg"
              alt="Игры и развлечения"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/laptops">
            <img
              src="https://static.insales-cdn.com/r/PtiaPWL_A_A/rs:fill-down:262:164:1/q:100/plain/files/1/5982/17307486/original/2.jpg@jpg"
              alt="Ноутбуки и компьютеры"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/kitchen_appliances">
            <img
              src="https://static.insales-cdn.com/r/m1-05_plB7Y/rs:fill-down:262:164:1/q:100/plain/files/1/5983/17307487/original/Component_5-2-min_a3479b068fde77f382b45c3f7b419e62.jpg@jpg"
              alt="Техника для кухни"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/televisions">
            <img
              src="https://static.insales-cdn.com/r/BNTP1gP9LBA/rs:fill-down:262:164:1/q:100/plain/files/1/5985/17307489/original/Component_5-4-min_4646b7946c16baf088d50f67227c015b.jpg@jpg"
              alt="Телевизоры и Hi-Fi"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/gaming_devices">
            <img
              src="https://static.insales-cdn.com/r/DWWbtp6QVt4/rs:fill-down:262:164:1/q:100/plain/files/1/5322/16364746/original/Component_5-3_143e82bedd6e26ac5f9ec8ec65aeb4cd.jpg@jpg"
              alt="Игры и развлечения"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>

        <div className={styles['category-showcase__item']}>
          <Link to="/products/video_equipments">
            <img
              src="https://static.insales-cdn.com/r/hRNxH7rEGgQ/rs:fill-down:262:164:1/q:100/plain/files/1/5988/17307492/original/Component_5-6-min_91fb6e58be8236a94503b5bf747c1db8.jpg@jpg"
              alt="Фото и видеотехника"
              className={styles['category-showcase__image']}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShowCase;
