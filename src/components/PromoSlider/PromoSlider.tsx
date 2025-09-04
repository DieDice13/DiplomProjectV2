import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const promo1 = '/promo_1.jpg';
const promo2 = '/promo_2.jpg';
const promo3 = '/promo_3.jpg';

const PromoSlider = () => {
  const promotions = [
    { id: 1, image: promo1, alt: 'Акция 1' },
    { id: 2, image: promo2, alt: 'Акция 2' },
    { id: 3, image: promo3, alt: 'Акция 3' },
  ];

  return (
    <div className="promotions-wrapper">
      <h3 className="mb-2 text-lg font-semibold">Акции</h3>

      {/* Сетка (desktop) */}
      <div className="hidden md:grid grid-cols-3 gap-5">
        {promotions.map(promo => (
          <div key={promo.id} className="overflow-hidden rounded-lg">
            <img
              src={promo.image}
              alt={promo.alt}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Слайдер (mobile) */}
      <div className="block md:hidden">
        <Swiper spaceBetween={20} slidesPerView={1} pagination={{ clickable: true }}>
          {promotions.map(promo => (
            <SwiperSlide key={promo.id}>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={promo.image}
                  alt={promo.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PromoSlider;
