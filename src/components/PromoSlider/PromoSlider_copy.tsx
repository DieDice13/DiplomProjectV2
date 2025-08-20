import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import styles from './PromoSlider.module.scss';

const promo1 = '/public/promo_1.jpg';
const promo2 = '/public/promo_2.jpg';
const promo3 = '/public/promo_3.jpg';

const PromoSlider = () => {
  const promotions = [
    { id: 1, image: promo1, alt: 'Акция 1' },
    { id: 2, image: promo2, alt: 'Акция 2' },
    { id: 3, image: promo3, alt: 'Акция 3' },
  ];

  return (
    <div className={styles['promotions-wrapper']}>
      <h3 className={styles['promotions-title']}>Акции</h3>

      <div className={styles['promotions-grid']}>
        {promotions.map(promo => (
          <div key={promo.id} className={styles['promotions-grid__item']}>
            <img
              src={promo.image}
              alt={promo.alt}
              className={styles['promotions-grid__image']}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className={styles['promotions-slider']}
      >
        {promotions.map(promo => (
          <SwiperSlide key={promo.id}>
            <div className={styles['promotions-slider__item']}>
              <img
                src={promo.image}
                alt={promo.alt}
                className={styles['promotions-slider__image']}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoSlider;
