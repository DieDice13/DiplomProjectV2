import { useEffect, useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  addFavorite,
  removeFavorite,
  clearFavorites,
  fetchFavorites,
  fetchFavoritesByIds,
  setFavorites,
  addLocalFavorite,
  removeLocalFavorite,
} from '../features/favorites/favoritesSlice';
import type { Product } from '../types/product';
import { GET_PRODUCTS_BY_IDS } from '../graphql/queries/getProductsByIds';
import { apolloClient } from '../lib/apollClient';
import { loadFavoritesState } from '../utils/localStorage';

const LEGACY_LOCAL_KEY = 'localFavorites';

export const useFavorites = () => {
  const user = useAppSelector(state => state.auth.user);
  const isAuthorized = Boolean(user);
  const favorites = useAppSelector(state => state.favorites.items);
  const loading = useAppSelector(
    state => state.favorites.loading || state.favorites.loadingAdd || state.favorites.loadingRemove,
  );
  const error = useAppSelector(state => state.favorites.error);

  const dispatch = useAppDispatch();

  /** Синхронизация локального и серверного избранного — только для авторизованных */
  const syncFavorites = useCallback(async () => {
    if (!isAuthorized) return;

    try {
      const localState = loadFavoritesState();
      const localIds: number[] = localState?.items?.map((p: Product) => p.id) || [];

      // Получаем избранное с сервера
      const serverFavorites = await dispatch(fetchFavorites()).unwrap();
      const serverIds = serverFavorites.map((p: Product) => p.id);

      // Объединяем локальные и серверные ID
      const mergedIds = Array.from(new Set([...serverIds, ...localIds]));

      // Отправляем на сервер недостающие товары
      for (const id of mergedIds) {
        if (!serverIds.includes(id)) {
          await dispatch(addFavorite({ id } as Product));
        }
      }

      // Обновляем избранное после синхронизации
      await dispatch(fetchFavorites());
    } catch (err) {
      console.error('Ошибка синхронизации избранного:', err);
    }
  }, [isAuthorized, dispatch]);

  /** Загрузка избранного при монтировании */
  useEffect(() => {
    if (isAuthorized) {
      syncFavorites();
      return;
    }

    // Неавторизованный: пробуем загрузить полное состояние favorites из localStorage
    const localState = loadFavoritesState();
    if (localState?.items?.length) {
      dispatch(setFavorites(localState.items));
      return;
    }

    // Миграция с старой модели где хранились только ID под ключом 'localFavorites'
    try {
      const legacyIds = JSON.parse(localStorage.getItem(LEGACY_LOCAL_KEY) || '[]') as number[];
      if (Array.isArray(legacyIds) && legacyIds.length > 0) {
        // подгружаем товары по id и сохраняем в redux (и затем store.subscribe сохранит в localStorage)
        dispatch(fetchFavoritesByIds(legacyIds));
        // удаляем старый ключ, чтобы не мигрировать повторно
        localStorage.removeItem(LEGACY_LOCAL_KEY);
        return;
      }
    } catch {
      // ignore
    }

    // иначе очищаем
    dispatch(clearFavorites());
  }, [isAuthorized, dispatch, syncFavorites]);

  /** Переключение состояния избранного */
  const toggleFavorite = useCallback(
    async (productOrId: Product | number, isFavorite: boolean) => {
      const productId = typeof productOrId === 'number' ? productOrId : productOrId.id;
      const productObj = typeof productOrId === 'number' ? null : productOrId;

      if (isAuthorized) {
        // Авторизованный — вызываем серверные thunks
        if (isFavorite) {
          await dispatch(removeFavorite(productId));
        } else {
          await dispatch(addFavorite(productObj ?? ({ id: productId } as Product)));
        }
        return;
      }

      // Гость — работаем локально через редьюсеры без отправки на сервер
      if (isFavorite) {
        dispatch(removeLocalFavorite(productId));
      } else {
        if (productObj) {
          dispatch(addLocalFavorite(productObj));
          return;
        }

        // Если у нас нет объекта продукта — пытаемся его подгрузить
        try {
          const { data } = await apolloClient.query({
            query: GET_PRODUCTS_BY_IDS,
            variables: { ids: [productId] },
          });
          const prod = data?.productsByIds?.[0];
          if (prod) {
            dispatch(addLocalFavorite(prod));
            return;
          }
        } catch {
          // игнорируем ошибки запроса
        }

        // Если не удалось подгрузить — добавляем минимум (id). UI должен уметь это корректно отобразить.
        dispatch(addLocalFavorite({ id: productId } as Product));
      }
    },
    [isAuthorized, dispatch],
  );

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    refetchFavorites: () => dispatch(fetchFavorites()),
    syncFavorites,
  };
};
