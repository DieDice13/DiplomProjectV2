import type { FC } from 'react';
import type { SortOption, AttributeWithValues, SelectedFilters, NormalizedFilters } from './types';
import SortControl from './SortControl';
import FilterPanel from './FilterPanel';

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

  const handleReset = () => {
    onFilterChange({}); // сброс фильтров
    onSortChange(undefined); // сброс сортировки
    Object.keys(expanded).forEach(key => {
      if (expanded[key]) {
        onToggleExpand(key);
      }
    });
  };

  return (
    <div className={'w-full'}>
      <SortControl selectedSort={selectedSort} onChange={onSortChange} />
      <FilterPanel
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
      />
    </div>
  );
};

// 👉 Экспортируем отдельно SortControl, чтобы использовать его в Catalog
export { SortControl };
