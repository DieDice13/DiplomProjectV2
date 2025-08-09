import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { apolloClient } from '../../lib/apollClient';
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from '../../graphql/mutations/favorites';
import { GET_MY_FAVORITES } from '../../graphql/queries/userCartFavorites';
import { gql } from '@apollo/client';

export interface FavoritesState {
  items: Product[];
  loading: boolean;
  loadingAdd: boolean;
  loadingRemove: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  loadingAdd: false,
  loadingRemove: false,
  error: null,
};

// Thunk: получить избранное пользователя (сервер)
export const fetchFavorites = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_MY_FAVORITES,
        fetchPolicy: 'network-only',
      });
      return data.favorites as Product[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки избранного');
    }
  },
);

// Thunk: получить товары по ID (для миграции/подгрузки)
export const fetchFavoritesByIds = createAsyncThunk<Product[], number[], { rejectValue: string }>(
  'favorites/fetchFavoritesByIds',
  async (ids, { rejectWithValue }) => {
    const QUERY_PRODUCTS_BY_IDS = gql`
      query GetFavoritesByIds($ids: [Int!]!) {
        productsByIds(ids: $ids) {
          id
          name
          price
          discount
          image
          category {
            id
            name
          }
        }
      }
    `;
    try {
      const { data } = await apolloClient.query({
        query: QUERY_PRODUCTS_BY_IDS,
        variables: { ids },
        fetchPolicy: 'network-only',
      });
      return data.productsByIds as Product[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки избранного по ID');
    }
  },
);

// Thunk: добавить в избранное (сервер) — используем только для авторизованных
export const addFavorite = createAsyncThunk<Product, Product, { rejectValue: string }>(
  'favorites/addFavorite',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_TO_FAVORITES,
        variables: { productId: product.id },
        update(cache, { data: { addToFavorites } }) {
          const existing = cache.readQuery<{ favorites: Product[] }>({
            query: GET_MY_FAVORITES,
          });
          if (existing && !existing.favorites.find(p => p.id === addToFavorites.id)) {
            cache.writeQuery({
              query: GET_MY_FAVORITES,
              data: {
                favorites: [...existing.favorites, addToFavorites],
              },
            });
          }
        },
      });
      return data.addToFavorites as Product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка добавления в избранное');
    }
  },
);

// Thunk: удалить из избранного (сервер) — используется только для авторизованных
export const removeFavorite = createAsyncThunk<number, number, { rejectValue: string }>(
  'favorites/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      await apolloClient.mutate({
        mutation: REMOVE_FROM_FAVORITES,
        variables: { productId },
        update(cache) {
          const existing = cache.readQuery<{ favorites: Product[] }>({
            query: GET_MY_FAVORITES,
          });
          if (existing) {
            cache.writeQuery({
              query: GET_MY_FAVORITES,
              data: {
                favorites: existing.favorites.filter(p => p.id !== productId),
              },
            });
          }
        },
      });
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка удаления из избранного');
    }
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    setFavorites(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },

    // Локальные действия для гостей (не вызывают сервер)
    addLocalFavorite(state, action: PayloadAction<Product>) {
      const exists = state.items.find(p => p.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeLocalFavorite(state, action: PayloadAction<number>) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      // fetchFavorites
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })

      // fetchFavoritesByIds
      .addCase(fetchFavoritesByIds.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritesByIds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavoritesByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })

      // addFavorite (серверный)
      .addCase(addFavorite.pending, state => {
        state.loadingAdd = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loadingAdd = false;
        if (!state.items.find(p => p.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loadingAdd = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })

      // removeFavorite (серверный)
      .addCase(removeFavorite.pending, state => {
        state.loadingRemove = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loadingRemove = false;
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loadingRemove = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearFavorites, setFavorites, addLocalFavorite, removeLocalFavorite } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
