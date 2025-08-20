// ProductSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';

type Props = {
  products: Product[];
};

const ProductSlider = ({ products }: Props) => {
  return (
    <section className="w-full relative">
      <h3 className="mb-2 text-lg font-semibold">Смартфоны</h3>
      <Swiper
        modules={[A11y]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 16 },
          375: { slidesPerView: 2, spaceBetween: 16 },
          425: { slidesPerView: 3, spaceBetween: 16 },
          640: { slidesPerView: 4, spaceBetween: 16 },
          768: { slidesPerView: 5, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
          1280: { slidesPerView: 6, spaceBetween: 28 },
          1536: { slidesPerView: 6, spaceBetween: 32 },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <div className="flex justify-center items-stretch">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductSlider;
