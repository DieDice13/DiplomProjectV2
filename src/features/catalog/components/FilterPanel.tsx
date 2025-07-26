import React from 'react';
import FilterItem from './FilterItem';
import type { AttributeWithValues, NormalizedFilters, SelectedFilters } from './types';
import type { FilterValue } from './FilterItem';

import styles from './FilterPanel.module.scss';

type Props = {
  filters: AttributeWithValues[];
  selectedFilters: SelectedFilters; // <-- используем как источник правды
  onFilterChange: (filters: NormalizedFilters) => void;
  onResetSort?: () => void;
  expanded: Record<string, boolean>;
  onToggleExpand: (param: string) => void;
};

const FilterPanel: React.FC<Props> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onResetSort,
  expanded,
  onToggleExpand,
}) => {
  const updateFilter = (param: string, value: string, checked: boolean) => {
    const prevSet = selectedFilters[param] || new Set();
    const newSet = new Set(prevSet);

    if (checked) {
      newSet.add(value);
    } else {
      newSet.delete(value);
    }

    // Создаём новую копию, чтобы гарантировать реактивность
    const updated: SelectedFilters = { ...selectedFilters };

    if (newSet.size > 0) {
      updated[param] = newSet;
    } else {
      delete updated[param]; // <-- 🔥 удаляем ключ, если фильтров нет
    }

    const transformed: NormalizedFilters = Object.fromEntries(
      Object.entries(updated).map(([key, set]) => [key, Array.from(set)]),
    );

    onFilterChange(transformed);
  };

  const resetFilters = () => {
    onFilterChange({});
    onResetSort?.();
  };

  return (
    <div className={styles.filters}>
      {filters.map(({ key, label, values }) => (
        <FilterItem
          key={key}
          parameter={key}
          label={label}
          values={values as FilterValue[]}
          expanded={!!expanded[key]}
          toggleExpand={() => onToggleExpand(key)}
          selectedFilters={selectedFilters[key] ?? new Set()}
          onChange={(value, checked) => updateFilter(key, value, checked)}
        />
      ))}
      <button className={styles.btn_reset_filters} onClick={resetFilters}>
        Сбросить
      </button>
    </div>
  );
};

export default FilterPanel;
