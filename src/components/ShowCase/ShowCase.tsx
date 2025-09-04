import { Link } from 'react-router-dom';

const showcaseItems = [
  {
    id: 1,
    href: '/products/microwaves',
    src: 'https://static.insales-cdn.com/r/mtbEwBAC41c/rs:fill-down:549:344:1/q:100/plain/files/1/5894/16365318/original/Component_5-5-min.jpg@jpg',
    alt: 'Стиральная машина',
    cols: 2,
    rows: 2,
  },
  {
    id: 2,
    href: '/products/gaming_devices',
    src: 'https://static.insales-cdn.com/r/DWWbtp6QVt4/rs:fill-down:262:164:1/q:100/plain/files/1/5322/16364746/original/Component_5-3_143e82bedd6e26ac5f9ec8ec65aeb4cd.jpg@jpg',
    alt: 'Игры и развлечения',
  },
  {
    id: 3,
    href: '/products/laptops',
    src: 'https://static.insales-cdn.com/r/PtiaPWL_A_A/rs:fill-down:262:164:1/q:100/plain/files/1/5982/17307486/original/2.jpg@jpg',
    alt: 'Ноутбуки и компьютеры',
  },
  {
    id: 4,
    href: '/products/kitchen_appliances',
    src: 'https://static.insales-cdn.com/r/m1-05_plB7Y/rs:fill-down:262:164:1/q:100/plain/files/1/5983/17307487/original/Component_5-2-min_a3479b068fde77f382b45c3f7b419e62.jpg@jpg',
    alt: 'Техника для кухни',
  },
  {
    id: 5,
    href: '/products/televisions',
    src: 'https://static.insales-cdn.com/r/BNTP1gP9LBA/rs:fill-down:262:164:1/q:100/plain/files/1/5985/17307489/original/Component_5-4-min_4646b7946c16baf088d50f67227c015b.jpg@jpg',
    alt: 'Телевизоры и Hi-Fi',
  },
  {
    id: 6,
    href: '/products/gaming_devices',
    src: 'https://static.insales-cdn.com/r/DWWbtp6QVt4/rs:fill-down:262:164:1/q:100/plain/files/1/5322/16364746/original/Component_5-3_143e82bedd6e26ac5f9ec8ec65aeb4cd.jpg@jpg',
    alt: 'Игры и развлечения',
  },
  {
    id: 7,
    href: '/products/video_equipments',
    src: 'https://static.insales-cdn.com/r/hRNxH7rEGgQ/rs:fill-down:262:164:1/q:100/plain/files/1/5988/17307492/original/Component_5-6-min_91fb6e58be8236a94503b5bf747c1db8.jpg@jpg',
    alt: 'Фото и видеотехника',
  },
];

const ShowCase = () => {
  return (
    <section className="my-4">
      <div
        className="
          grid grid-cols-4 grid-rows-2 gap-4
          max-md:flex max-md:flex-row max-md:gap-2 max-md:overflow-x-auto max-md:pb-2
          max-md:scroll-snap-x mandatory
        "
      >
        {showcaseItems.map(item => (
          <div
            key={item.id}
            className={`max-md:flex-[0_0_38vw] max-md:scroll-snap-start ${
              item.cols ? `col-span-${item.cols}` : ''
            } ${item.rows ? `row-span-${item.rows}` : ''}`}
          >
            <Link to={item.href}>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto max-md:aspect-[3/2] max-md:object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowCase;
