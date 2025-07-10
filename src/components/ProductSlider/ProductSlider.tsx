// ProductSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
/* import 'swiper/css/navigation';
import 'swiper/css/pagination'; */

import type { Product } from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductSlider.module.scss';

type Props = {
  products: Product[];
};

const ProductSlider = ({ products }: Props) => {
  return (
    <div className={styles['product-slider']}>
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={16}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          // ≥ 640px — маленькие смартфоны горизонтально или средние телефоны
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },

          // ≥ 768px — планшеты в портретной ориентации, большие смартфоны горизонтально
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          // ≥ 1024px — планшеты в альбомной, ноутбуки
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },

          // ≥ 1280px — десктопы, стандартные ноутбуки
          1280: {
            slidesPerView: 5,
            spaceBetween: 28,
          },

          // ≥ 1536px — широкие экраны, 2K и выше
          1536: {
            slidesPerView: 6,
            spaceBetween: 32,
          },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
