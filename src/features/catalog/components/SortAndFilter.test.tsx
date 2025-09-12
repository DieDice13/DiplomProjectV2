import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortAndFilter } from './SortAndFilter';
import type { AttributeWithValues, SelectedFilters, SortOption } from './types';

describe('SortAndFilter', () => {
  const filters: AttributeWithValues[] = [
    {
      key: 'color',
      label: 'Цвет',
      type: 'string',
      values: [
        { value: 'Red', count: 10 },
        { value: 'Blue', count: 5 },
      ],
    },
  ];

  it('сбрасывает фильтры и сортировку при клике на "Сбросить"', () => {
    const onFilterChange = vi.fn<(filters: SelectedFilters) => void>();
    const onSortChange = vi.fn<(sort: SortOption | undefined) => void>();
    const onToggleExpand = vi.fn();

    render(
      <SortAndFilter
        filters={filters}
        selectedFilters={{ color: new Set(['Red']) }}
        selectedSort="PRICE_ASC"
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        expanded={{ color: true }}
        onToggleExpand={onToggleExpand}
      />,
    );

    // Кликаем "Сбросить"
    fireEvent.click(screen.getByText('Сбросить'));

    expect(onFilterChange).toHaveBeenCalledWith({});
    expect(onSortChange).toHaveBeenCalledWith(undefined);
    expect(onToggleExpand).toHaveBeenCalledWith('color');
  });
});
