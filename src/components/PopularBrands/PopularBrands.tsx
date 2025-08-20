import { brandImages } from './brands.data';

const PopularBrands = () => {
  return (
    <section className="mb-5 container">
      <h3 className="text-center mb-5 text-2xl font-semibold">Популярные бренды</h3>

      {/* Контейнер для скролла на мобильных */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="
            grid gap-2 justify-items-center items-center
            grid-cols-8
            max-[1200px]:grid-cols-6
            max-[900px]:grid-cols-4
            max-[767px]:grid-cols-[repeat(8,80px)] max-[767px]:min-w-[680px] max-[767px]:grid-rows-2 max-[767px]:justify-start max-[767px]:pb-2
          "
        >
          {brandImages.map(brand => (
            <div
              key={brand.id}
              className="w-full max-[767px]:w-[80px] flex items-center justify-center"
            >
              <img src={brand.src} alt={brand.alt} className="max-w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
