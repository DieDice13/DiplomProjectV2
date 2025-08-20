import React from 'react';

import styles from './FilterItem.module.scss';

export type FilterValue = {
  value: string;
  count: number;
};

type Props = {
  parameter: string;
  label: string;
  values: FilterValue[]; // изменено
  expanded: boolean;
  toggleExpand: () => void;
  selectedFilters: Set<string>;
  onChange: (value: string, checked: boolean) => void;
};

const FilterItem: React.FC<Props> = ({
  label,
  values,
  expanded,
  toggleExpand,
  selectedFilters,
  onChange,
}) => {
  return (
    <div className={styles['filter-item']}>
      <div className={styles['filter-header']} onClick={toggleExpand}>
        {label}
      </div>
      {expanded && (
        <div className={styles['filter-options']}>
          {values.length > 0 ? (
            values.map(({ value, count }) => (
              <label key={value} className={styles['filter-label']}>
                <input
                  type="checkbox"
                  checked={selectedFilters.has(value)}
                  onChange={e => onChange(value, e.target.checked)}
                  className={styles['filter-checkbox']}
                />
                {value}
                <span className={styles['filter-count']}>({count})</span>
              </label>
            ))
          ) : (
            <div>Нет значений</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterItem;
