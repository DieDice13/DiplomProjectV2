import styles from './Footer.module.scss';
import Contacts from './Contacts.tsx';
import Socials from './Socials.tsx';
import FooterMenu from './FooterMenu.tsx';
import Payments from './Payments.tsx';
import Container from '../Container/Container.tsx';

function Footer() {
  return (
    <footer className={styles.footerSection}>
      <Container>
        <div className={`${styles.footerTop}`}>
          <div className={styles['contactsSocials']}>
            <Contacts />
            <Socials />
          </div>
          <FooterMenu />
        </div>
      </Container>

      <div className={`${styles.footerBottom}`}>
        <Container>
          <div className={styles['footerBottomInner']}>
            <p className={styles.copyright}>
              © 2020 Любое использование контента без письменного разрешения запрещено
            </p>
            <Payments />
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
