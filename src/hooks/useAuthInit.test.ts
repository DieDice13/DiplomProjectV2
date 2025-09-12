import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAuthInit } from './useAuthInit';
import { setUser } from '../components/Auth/authSlice';

// Моки
const dispatchMock = vi.fn();

vi.mock('./useAppDispatch', () => ({
  useAppDispatch: () => dispatchMock,
}));

const lazyQueryMock = vi.fn();

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<any>('@apollo/client');
  return {
    ...actual,
    useLazyQuery: () => [lazyQueryMock],
  };
});

// Тесты
describe('useAuthInit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('не вызывает getCurrentUser если токена нет', async () => {
    await act(async () => {
      renderHook(() => useAuthInit());
      await Promise.resolve();
    });

    expect(lazyQueryMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('вызывает getCurrentUser и диспатчит setUser при наличии токена', async () => {
    localStorage.setItem('token', '12345');

    const fakeUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    lazyQueryMock.mockResolvedValue({ data: { me: fakeUser } });

    await act(async () => {
      renderHook(() => useAuthInit());
      await Promise.resolve();
    });

    expect(lazyQueryMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith(setUser(fakeUser));
  });

  it('удаляет токен при ошибке запроса', async () => {
    localStorage.setItem('token', '12345');
    lazyQueryMock.mockRejectedValue(new Error('fail'));

    await act(async () => {
      renderHook(() => useAuthInit());
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('не диспатчит setUser если me вернулся null', async () => {
    localStorage.setItem('token', '12345');
    lazyQueryMock.mockResolvedValue({ data: { me: null } });

    await act(async () => {
      renderHook(() => useAuthInit());
      await Promise.resolve();
    });

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
