import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useLazyQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries/getCurrentUser';
import { setUser } from '../components/Auth/authSlice';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (process.env.NODE_ENV !== 'test') {
        console.log('❌ Токен отсутствует в localStorage');
      }
      return;
    }

    getCurrentUser()
      .then(({ data }) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log('📨 Ответ от запроса me:', data);
        }
        if (data?.me) {
          dispatch(setUser(data.me));
        } else {
          if (process.env.NODE_ENV !== 'test') {
            console.warn('⚠️ me вернулся null');
          }
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'test') {
          console.error('🚨 Ошибка запроса me:', err);
        }
        localStorage.removeItem('token');
      });
  }, []);
};
