import { brandImages } from './brands.data';

const PopularBrands = () => {
  return (
    <section className="my-4 container">
      {/* Заголовок секции */}
      <h3 className="text-center mb-5 text-2xl font-semibold">Популярные бренды</h3>

      {/* Контейнер для горизонтального скролла на мобильных */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="
            grid gap-2 justify-items-center items-center
            grid-cols-8
            max-[1200px]:grid-cols-6
            max-[900px]:grid-cols-4
            /* Для мобильных экранов: фиксированная ширина и две строки, чтобы скролл был удобнее */
            max-[767px]:grid-cols-[repeat(8,80px)] max-[767px]:min-w-[680px] max-[767px]:grid-rows-2 max-[767px]:justify-start max-[767px]:pb-2
          "
        >
          {/* Рендерим все бренды из data файла */}
          {brandImages.map(brand => (
            <div
              key={brand.id}
              className="w-full max-[767px]:w-[80px] flex items-center justify-center"
            >
              <img
                src={brand.src}
                alt={brand.alt} // важен для SEO и доступности
                className="max-w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
