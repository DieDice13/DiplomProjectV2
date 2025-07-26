import type { SortOption } from './types';

export const mapSortValueToEnum = (value: string): SortOption | undefined => {
  switch (value) {
    case 'price-asc':
      return 'PRICE_ASC';
    case 'price-desc':
      return 'PRICE_DESC';
    case 'name-asc':
      return 'NAME_ASC';
    case 'name-desc':
      return 'NAME_DESC';
    default:
      return undefined; // чтобы можно было сбросить сортировку
  }
};
