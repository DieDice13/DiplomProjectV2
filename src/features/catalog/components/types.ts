export interface AttributeWithValues {
  key: string;
  label: string;
  type: string;
  values: { value: string; count: number }[]; // ← изменено!
}

export type SortOption = 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC' | 'NAME_DESC';

export type NormalizedFilters = Record<string, string[]>;

export type SelectedFilters = Record<string, Set<string>>;
