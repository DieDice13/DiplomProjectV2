function FooterMenu() {
  return (
    <div className="flex flex-wrap gap-12 max-[1110px]:flex-col max-[1110px]:gap-8">
      <div className="min-w-[140px]">
        <h4 className="font-bold mb-2">О магазине</h4>
        <ul>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              Условия обмена и возврата
            </a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              Каталог
            </a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              О компании
            </a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              Контакты
            </a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              Доставка
            </a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#" className="text-black no-underline">
              Оплата
            </a>
          </li>
        </ul>
      </div>

      <div className="min-w-[140px]">
        <h4 className="font-bold mb-2">Клиентам</h4>
        <ul>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#">Личный кабинет</a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#">Блог</a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#">Обратная связь</a>
          </li>
        </ul>
      </div>

      <div className="min-w-[140px]">
        <h4 className="font-bold mb-2">Информация</h4>
        <ul>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#">Пользовательское соглашение</a>
          </li>
          <li className="my-5 text-sm max-[1110px]:text-xs">
            <a href="#">Политика конфиденциальности и оферта</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FooterMenu;
