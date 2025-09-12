import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterItem, { type FilterValue } from './FilterItem';

describe('FilterItem', () => {
  const mockValues: FilterValue[] = [
    { value: 'Red', count: 10 },
    { value: 'Blue', count: 5 },
  ];

  it('рендерит заголовок фильтра', () => {
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={mockValues}
        expanded={false}
        toggleExpand={() => {}}
        selectedFilters={new Set()}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Цвет')).toBeInTheDocument();
  });

  it('вызывает toggleExpand при клике на заголовок', () => {
    const toggleExpand = vi.fn();
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={mockValues}
        expanded={false}
        toggleExpand={toggleExpand}
        selectedFilters={new Set()}
        onChange={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('Цвет'));
    expect(toggleExpand).toHaveBeenCalled();
  });

  it('показывает список значений, если expanded=true', () => {
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={mockValues}
        expanded={true}
        toggleExpand={() => {}}
        selectedFilters={new Set()}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('показывает текст "Нет значений", если values пустой', () => {
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={[]}
        expanded={true}
        toggleExpand={() => {}}
        selectedFilters={new Set()}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText('Нет значений')).toBeInTheDocument();
  });

  it('отмечает чекбоксы из selectedFilters', () => {
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={mockValues}
        expanded={true}
        toggleExpand={() => {}}
        selectedFilters={new Set(['Red'])}
        onChange={() => {}}
      />,
    );
    const redCheckbox = screen.getByLabelText(/Red/);
    expect(redCheckbox).toBeChecked();
  });

  it('вызывает onChange при изменении чекбокса', () => {
    const onChange = vi.fn();
    render(
      <FilterItem
        parameter="color"
        label="Цвет"
        values={mockValues}
        expanded={true}
        toggleExpand={() => {}}
        selectedFilters={new Set()}
        onChange={onChange}
      />,
    );
    const redCheckbox = screen.getByLabelText(/Red/);
    fireEvent.click(redCheckbox);
    expect(onChange).toHaveBeenCalledWith('Red', true);
  });
});
