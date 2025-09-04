import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Product } from '../../types/product';
import ProductCard from '../ProductCard/ProductCard';

type Props = {
  products: Product[];
  title: string;
};

const ProductSlider = ({ products, title }: Props) => {
  return (
    <section className="w-full relative my-4">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <Swiper
        modules={[A11y]}
        spaceBetween={12}
        slidesPerView={1.5}
        keyboard={{ enabled: true }}
        loop={products.length > 1}
        breakpoints={{
          320: { slidesPerView: 2 }, // вместо 1.5
          425: { slidesPerView: 3 }, // вместо 2.5
          640: { slidesPerView: 4 }, // вместо 3
          768: { slidesPerView: 4.5 }, // вместо 3.5
          1024: { slidesPerView: 5 }, // вместо 4
          1280: { slidesPerView: 6 }, // вместо 5
          1440: { slidesPerView: 7 }, // вместо 6
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductSlider;
