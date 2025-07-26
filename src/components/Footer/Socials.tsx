import styles from './Footer.module.scss';
import TelegramIcon from '../../assets/icons/Socials/icon_telegram.svg?react';

import OdnoklassnikiIcon from '../../assets/icons/Socials/icon_odnoklassniki.svg?react';

import YoutubeIcon from '../../assets/icons/Socials/icon_youtube.svg?react';

import VkIcon from '../../assets/icons/Socials/icon_vk.svg?react';

function Socials() {
  return (
    <div className={styles.socials}>
      <h6>Оставайтесь на связи</h6>
      <ul className={styles.socialList}>
        <li>
          <a href="#">
            <TelegramIcon width={25} height={25} />
          </a>
        </li>
        <li>
          <a href="#">
            <OdnoklassnikiIcon width={25} height={25} />
          </a>
        </li>
        <li>
          <a href="#">
            <YoutubeIcon width={25} height={25} />
          </a>
        </li>
        <li>
          <a href="#">
            <VkIcon width={25} height={25} />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Socials;
