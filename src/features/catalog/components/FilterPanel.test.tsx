import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterPanel from './FilterPanel';
import type { AttributeWithValues, NormalizedFilters } from './types';

describe('FilterPanel', () => {
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
    {
      key: 'size',
      label: 'Размер',
      type: 'string',
      values: [
        { value: 'M', count: 7 },
        { value: 'L', count: 3 },
      ],
    },
  ];

  it('рендерит фильтры по списку', () => {
    render(
      <FilterPanel
        filters={filters}
        selectedFilters={{}}
        onFilterChange={() => {}}
        expanded={{ color: true, size: false }}
        onToggleExpand={() => {}}
      />,
    );

    expect(screen.getByText('Цвет')).toBeInTheDocument();
    expect(screen.getByText('Размер')).toBeInTheDocument();
  });

  it('вызывает onToggleExpand при клике по заголовку', () => {
    const onToggleExpand = vi.fn();
    render(
      <FilterPanel
        filters={filters}
        selectedFilters={{}}
        onFilterChange={() => {}}
        expanded={{ color: false, size: false }}
        onToggleExpand={onToggleExpand}
      />,
    );

    fireEvent.click(screen.getByText('Цвет'));
    expect(onToggleExpand).toHaveBeenCalledWith('color');
  });

  it('добавляет фильтр при выборе чекбокса', () => {
    const onFilterChange = vi.fn<(filters: NormalizedFilters) => void>();
    render(
      <FilterPanel
        filters={filters}
        selectedFilters={{}}
        onFilterChange={onFilterChange}
        expanded={{ color: true, size: false }}
        onToggleExpand={() => {}}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Red/));
    expect(onFilterChange).toHaveBeenCalledWith({
      color: ['Red'],
    });
  });

  it('удаляет параметр при снятии последнего фильтра', () => {
    const onFilterChange = vi.fn<(filters: NormalizedFilters) => void>();
    render(
      <FilterPanel
        filters={filters}
        selectedFilters={{ color: new Set(['Red']) }}
        onFilterChange={onFilterChange}
        expanded={{ color: true, size: false }}
        onToggleExpand={() => {}}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Red/));
    expect(onFilterChange).toHaveBeenCalledWith({});
  });

  it('вызывает onReset при клике на кнопку сброса', () => {
    const onReset = vi.fn();
    render(
      <FilterPanel
        filters={filters}
        selectedFilters={{}}
        onFilterChange={() => {}}
        onReset={onReset}
        expanded={{ color: true, size: true }}
        onToggleExpand={() => {}}
      />,
    );

    fireEvent.click(screen.getByText('Сбросить'));
    expect(onReset).toHaveBeenCalled();
  });
});
