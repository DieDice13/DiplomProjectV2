import styles from './Footer.module.scss';

import MasterCardIcon from '../../assets/icons/Payments/master_card.svg?react';
import VisaIcon from '../../assets/icons/Payments/visa.svg?react';
import MirIcon from '../../assets/icons/Payments/mir.svg?react';

function Payments() {
  return (
    <ul className={styles.payments}>
      <li>
        <MasterCardIcon />
      </li>
      <li>
        <VisaIcon />
      </li>
      <li>
        <MirIcon />
      </li>
    </ul>
  );
}

export default Payments;
