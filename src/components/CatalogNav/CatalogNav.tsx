import { Link } from 'react-router-dom';

const categories = [
  { path: '/products/smartphones', label: 'Смартфоны' },
  { path: '/products/laptops', label: 'Ноутбуки' },
  { path: '/products/microwaves', label: 'Микроволновки' },
  { path: '/products/gaming_devices', label: 'Игровые устройства' },
  { path: '/products/televisions', label: 'Телевизоры' },
  { path: '/products/video_equipments', label: 'Видеооборудование' },
  { path: '/products/kitchen_appliances', label: 'Кухонная техника' },
];

const CatalogNav = () => {
  return (
    <div className="relative z-10 bg-white">
      {/* линия сверху на всю ширину контейнера */}
      <div className="absolute top-0 left-0 w-full h-px bg-neutral-200 pointer-events-none" />

      {/* тень снизу на всю ширину контейнера */}
      <div className="absolute bottom-0 left-0 w-full h-2 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.15)] pointer-events-none -z-10" />

      <div
        className="flex justify-between gap-4 overflow-x-auto overflow-y-hidden py-2 pb-3
        scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200
        [-webkit-overflow-scrolling:touch]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156,163,175,1) rgba(229,231,235,1)',
        }}
      >
        {categories.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="flex-shrink-0 whitespace-nowrap px-3 py-0.5 text-[color:var(--text-color)]
            hover:text-[color:var(--site-selector)] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CatalogNav;
