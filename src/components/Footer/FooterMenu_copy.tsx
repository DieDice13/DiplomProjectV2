import styles from './Footer.module.scss';

function FooterMenu() {
  return (
    <div className={styles.menu}>
      <div>
        <h4>О магазине</h4>
        <ul>
          <li>
            <a href="#">Условия обмена и возврата</a>
          </li>
          <li>
            <a href="#">Каталог</a>
          </li>
          <li>
            <a href="#">О компании</a>
          </li>
          <li>
            <a href="#">Контакты</a>
          </li>
          <li>
            <a href="#">Доставка</a>
          </li>
          <li>
            <a href="#">Оплата</a>
          </li>
        </ul>
      </div>

      <div>
        <h4>Клиентам</h4>
        <ul>
          <li>
            <a href="#">Личный кабинет</a>
          </li>
          <li>
            <a href="#">Блог</a>
          </li>
          <li>
            <a href="#">Обратная связь</a>
          </li>
        </ul>
      </div>

      <div>
        <h4>Информация</h4>
        <ul>
          <li>
            <a href="#">Пользовательское соглашение</a>
          </li>
          <li>
            <a href="#">Политика конфиденциальности и оферта</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FooterMenu;
