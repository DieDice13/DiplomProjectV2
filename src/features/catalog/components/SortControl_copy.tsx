import type { SortOption } from './types';
import { mapSortValueToEnum } from './sortUtils';

import styles from './SortControl.module.scss';

type Props = {
  selectedSort?: SortOption;
  onChange: (value: SortOption | undefined) => void;
};

const SortControl = ({ selectedSort, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'default') {
      onChange(undefined); // сброс сортировки
      return;
    }
    const mapped = mapSortValueToEnum(e.target.value);
    if (mapped) {
      onChange(mapped);
    }
  };

  return (
    <div className={styles.catalog__sorting}>
      <select
        className={styles['catalog__sorting-select']}
        value={selectedSort?.toLowerCase().replace('_', '-') ?? 'default'}
        onChange={handleChange}
      >
        <option value="default">Сортировка</option>
        <option value="price-asc">По цене: низкая → высокая</option>
        <option value="price-desc">По цене: высокая → низкая</option>
        <option value="name-asc">По названию: A → Z</option>
        <option value="name-desc">По названию: Z → A</option>
      </select>
    </div>
  );
};

export default SortControl;
