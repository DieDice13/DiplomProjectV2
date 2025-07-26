// ProductSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductSlider.module.scss';

type Props = {
  products: Product[];
};

const ProductSlider = ({ products }: Props) => {
  return (
    <>
      <h3 className={styles['product-slider-title']}>Смартфоны</h3>
      <div className={styles['product-slider']}>
        <Swiper
          modules={[A11y]}
          spaceBetween={16}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            // < 320px — маленькие смартфоны в портретной ориентации
            320: {
              slidesPerView: 2,
              spaceBetween: 16,
            },

            // < 320px — маленькие смартфоны в портретной ориентации
            375: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            // < 320px — маленькие смартфоны в портретной ориентации
            425: {
              slidesPerView: 3,
              spaceBetween: 16,
            },

            // ≥ 640px — маленькие смартфоны горизонтально или средние телефоны
            640: {
              slidesPerView: 4,
              spaceBetween: 16,
            },

            // ≥ 768px — планшеты в портретной ориентации, большие смартфоны горизонтально
            768: {
              slidesPerView: 5,
              spaceBetween: 20,
            },

            // ≥ 1024px — планшеты в альбомной, ноутбуки
            1024: {
              slidesPerView: 5,
              spaceBetween: 24,
            },

            // ≥ 1280px — десктопы, стандартные ноутбуки
            1280: {
              slidesPerView: 6,
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
    </>
  );
};

export default ProductSlider;
