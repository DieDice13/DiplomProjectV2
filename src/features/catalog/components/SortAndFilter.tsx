import type { FC } from 'react';
import type { SortOption, AttributeWithValues, SelectedFilters, NormalizedFilters } from './types';
import SortControl from './SortControl';
import FilterPanel from './FilterPanel';

import styles from './SortAndFilter.module.scss';

type Props = {
  filters: AttributeWithValues[];
  selectedFilters: SelectedFilters;
  selectedSort?: SortOption;
  onSortChange: (sort: SortOption | undefined) => void;
  onFilterChange: (filters: SelectedFilters) => void;
  expanded: Record<string, boolean>;
  onToggleExpand: (param: string) => void;
};

export const SortAndFilter: FC<Props> = ({
  filters,
  selectedSort,
  onSortChange,
  onFilterChange,
  selectedFilters,
  expanded,
  onToggleExpand,
}) => {
  const handleFilterChange = (filters: NormalizedFilters) => {
    const selected: SelectedFilters = {};
    for (const key in filters) {
      selected[key] = new Set(filters[key]);
    }
    onFilterChange(selected);
  };

  return (
    <div className={styles.SortAndFilter}>
      <SortControl selectedSort={selectedSort} onChange={onSortChange} />
      <FilterPanel
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange} // <-- используем обёртку
        onResetSort={() => onSortChange(undefined)}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
      />
    </div>
  );
};
