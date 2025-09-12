import { describe, it, expect } from 'vitest';
import { mapSortValueToEnum } from './sortUtils';
import type { SortOption } from './types';

describe('mapSortValueToEnum', () => {
  it('возвращает PRICE_ASC для "price-asc"', () => {
    expect(mapSortValueToEnum('price-asc')).toBe<SortOption>('PRICE_ASC');
  });

  it('возвращает PRICE_DESC для "price-desc"', () => {
    expect(mapSortValueToEnum('price-desc')).toBe<SortOption>('PRICE_DESC');
  });

  it('возвращает NAME_ASC для "name-asc"', () => {
    expect(mapSortValueToEnum('name-asc')).toBe<SortOption>('NAME_ASC');
  });

  it('возвращает NAME_DESC для "name-desc"', () => {
    expect(mapSortValueToEnum('name-desc')).toBe<SortOption>('NAME_DESC');
  });

  it('возвращает undefined для неподдерживаемых значений', () => {
    expect(mapSortValueToEnum('random')).toBeUndefined();
    expect(mapSortValueToEnum('')).toBeUndefined();
  });
});
