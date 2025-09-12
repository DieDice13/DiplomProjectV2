import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SortControl from './SortControl';
import type { SortOption } from './types';

describe('SortControl', () => {
  it('рендерит все опции сортировки', () => {
    render(<SortControl onChange={() => {}} />);

    expect(screen.getByText('Сортировка')).toBeInTheDocument();
    expect(screen.getByText('По цене: низкая → высокая')).toBeInTheDocument();
    expect(screen.getByText('По цене: высокая → низкая')).toBeInTheDocument();
    expect(screen.getByText('По названию: A → Z')).toBeInTheDocument();
    expect(screen.getByText('По названию: Z → A')).toBeInTheDocument();
  });

  it('отображает значение по умолчанию, если selectedSort не передан', () => {
    render(<SortControl onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('default');
  });

  it('правильно отображает выбранный сортировочный вариант', () => {
    render(<SortControl selectedSort="PRICE_DESC" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('price-desc');
  });

  it('вызывает onChange(undefined), если выбрать "Сортировка"', () => {
    const onChange = vi.fn<(value: SortOption | undefined) => void>();
    render(<SortControl selectedSort="PRICE_ASC" onChange={onChange} />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'default' } });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('вызывает onChange с enum значением при выборе опции', () => {
    const onChange = vi.fn<(value: SortOption | undefined) => void>();
    render(<SortControl onChange={onChange} />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'name-desc' } });
    expect(onChange).toHaveBeenCalledWith('NAME_DESC');
  });
});
