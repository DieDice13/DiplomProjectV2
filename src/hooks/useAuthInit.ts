import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useLazyQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries/getCurrentUser';
import { setUser } from '../components/Auth/authSlice';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);

  useEffect(() => {
    // console.log('🔥 useAuthInit сработал');

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Токен отсутствует в localStorage');
      return;
    }

    // console.log('📦 Токен найден:', token);

    getCurrentUser()
      .then(({ data }) => {
        console.log('📨 Ответ от запроса me:', data);
        if (data?.me) {
          dispatch(setUser(data.me));
        } else {
          console.warn('⚠️ me вернулся null');
        }
      })
      .catch(err => {
        console.error('🚨 Ошибка запроса me:', err);
        localStorage.removeItem('token');
      });
  }, []);
};
