import styles from './Footer.module.scss';

function Contacts() {
  return (
    <div className={styles.contacts}>
      <a href="/" className={styles.logo}>
        TECHDICE
      </a>

      <div className={styles.contactGroup}>
        <div>
          <a href="tel:+77007077777" className={styles.phone}>
            +7(700) 707-77-77
          </a>
          <p>Справочная служба</p>
        </div>
        <div>
          <a href="tel:+77007077777" className={styles.phone}>
            +7(700) 707-77-77
          </a>
          <p>Интернет-магазин</p>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
