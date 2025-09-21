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
    <div
      className="relative z-10 bg-white w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
        before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-neutral-200 before:pointer-events-none
        after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-2 after:shadow-[0_4px_6px_-2px_rgba(0,0,0,0.15)] after:pointer-events-none after:-z-10"
    >
      <div
        className="flex justify-between gap-4 overflow-x-auto overflow-y-hidden py-2 pb-3
        scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-neutral-200
        [-webkit-overflow-scrolling:touch] max-w-screen-xl mx-auto"
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
