export interface SubCategory {
  path: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  image: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: 'smartphones',
    label: 'Смартфоны и планшеты',
    image: '/Catalog_Menu_Category/smartphones_laptops.webp',
    subCategories: [
      { path: '/products/smartphones', label: 'Смартфоны' },
      { path: '/products/tablets', label: 'Планшеты' },
      { path: '/products/ebooks', label: 'Электронные книги' },
      { path: '/products/smartwatches', label: 'Смарт-часы' },
      { path: '/products/wearables', label: 'Фитнес-браслеты' },
    ],
  },
  {
    id: 'laptops',
    label: 'Ноутбуки, планшеты и компьютеры',
    image: '/Catalog_Menu_Category/laptops_tablets_pc.webp',
    subCategories: [
      { path: '/products/laptops', label: 'Ноутбуки' },
      { path: '/products/gaming-laptops', label: 'Игровые ноутбуки' },
      { path: '/products/ultrabooks', label: 'Ультрабуки' },
      { path: '/products/monoblocks', label: 'Моноблоки' },
      { path: '/products/desktops', label: 'Системные блоки' },
      { path: '/products/monitors', label: 'Мониторы' },
    ],
  },
  {
    id: 'home-tech',
    label: 'Техника для дома',
    image: '/Catalog_Menu_Category/home-appliances.webp',
    subCategories: [
      { path: '/products/conditioners', label: 'Кондиционеры' },
      { path: '/products/fans', label: 'Вентиляторы' },
      { path: '/products/radiators', label: 'Радиаторы' },
      { path: '/products/robot-vacuums', label: 'Роботы-пылесосы' },
      { path: '/products/vacuum-cleaners', label: 'Пылесосы' },
      { path: '/products/wash-machines', label: 'Стиральные машины' },
      { path: '/products/dryers', label: 'Сушильные машины' },
      { path: '/products/dishwashers', label: 'Посудомоечные машины' },
    ],
  },
  {
    id: 'games',
    label: 'Игры и развлечения',
    image: '/Catalog_Menu_Category/games_and_entertainment.webp',
    subCategories: [
      { path: '/products/ps5', label: 'Консоли PS5' },
      { path: '/products/ps4', label: 'Консоли PS4' },
      { path: '/products/ps4-games', label: 'Игры для PS4' },
      { path: '/products/ps5-games', label: 'Игры для PS5' },
      { path: '/products/xbox', label: 'Консоли Xbox' },
      { path: '/products/xbox-games', label: 'Игры для Xbox' },
      { path: '/products/xbox-subscriptions', label: 'Подписки Xbox' },
      { path: '/products/nintendo-switch', label: 'Nintendo Switch' },
      { path: '/products/vr-headsets', label: 'VR-гарнитуры' },
    ],
  },
  {
    id: 'tv-audio',
    label: 'Телевизоры, Аудио-видео, Hi-Fi',
    image: '/Catalog_Menu_Category/televisions_audio-video_HI-FI.webp',
    subCategories: [
      { path: '/products/tv', label: 'Все телевизоры' },
      { path: '/products/uhd-tv', label: '4K UHD-телевизоры' },
      { path: '/products/8k-tv', label: '8K-телевизоры' },
      { path: '/products/smart-tv', label: 'Смарт-телевизоры' },
      { path: '/products/soundbars', label: 'Саундбары' },
      { path: '/products/home-theatre', label: 'Домашние кинотеатры' },
      { path: '/products/headphones', label: 'Наушники' },
      { path: '/products/speakers', label: 'Колонки и акустика' },
      { path: '/products/projectors', label: 'Проекторы' },
    ],
  },
  {
    id: 'photo-video',
    label: 'Фото и видеотехника',
    image: '/Catalog_Menu_Category/photo_and_video-equipment.webp',
    subCategories: [
      { path: '/products/photo-cameras', label: 'Цифровые фотоаппараты' },
      { path: '/products/lenses', label: 'Объективы' },
      { path: '/products/video-cameras', label: 'Видеокамеры 4K' },
      { path: '/products/drones', label: 'Дроны' },
      { path: '/products/gopro', label: 'GoPro экшн-камеры' },
      { path: '/products/sony-cams', label: 'Sony экшн-камеры' },
      { path: '/products/tripods', label: 'Штативы' },
      { path: '/products/lighting', label: 'Осветительное оборудование' },
    ],
  },
  {
    id: 'kitchen-tech',
    label: 'Бытовая техника для кухни',
    image: '/Catalog_Menu_Category/household-appliances-for-the-kitchen.webp',
    subCategories: [
      { path: '/products/microwaves', label: 'Микроволновые печи' },
      { path: '/products/multicookers', label: 'Мультиварки' },
      { path: '/products/ovens', label: 'Духовые шкафы' },
      { path: '/products/cooktops', label: 'Варочные панели' },
      { path: '/products/mixers', label: 'Миксеры и блендеры' },
      { path: '/products/meat-grinders', label: 'Мясорубки' },
      { path: '/products/coffee-machines', label: 'Кофемашины' },
      { path: '/products/kettles', label: 'Электрочайники' },
      { path: '/products/toasters', label: 'Тостеры' },
      { path: '/products/bread-makers', label: 'Хлебопечки' },
    ],
  },
  {
    id: 'beauty',
    label: 'Красота и здоровье',
    image: '/Catalog_Menu_Category/beauty_and_health.webp',
    subCategories: [
      { path: '/products/hair-dryers', label: 'Фены' },
      { path: '/products/hair-brushes', label: 'Фен-щётки' },
      { path: '/products/multi-stylers', label: 'Мультистайлеры' },
      { path: '/products/straighteners', label: 'Выпрямители волос' },
      { path: '/products/shavers', label: 'Электробритвы' },
      { path: '/products/trimmers', label: 'Триммеры' },
      { path: '/products/epilators', label: 'Эпиляторы' },
      { path: '/products/massagers', label: 'Массажёры' },
      { path: '/products/scales', label: 'Электронные весы' },
    ],
  },
];
