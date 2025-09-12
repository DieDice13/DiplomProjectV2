import authReducer, { setUser, clearUser, logout } from './authSlice';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('authSlice', () => {
  const initialState = { user: null, isAuthInitialized: false };

  beforeEach(() => {
    // мокаем removeItem перед каждым тестом
    vi.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setUser должен записывать пользователя и ставить isAuthInitialized = true', () => {
    const user = { id: 1, name: 'Test', email: 'test@mail.com' };
    const newState = authReducer(initialState, setUser(user));

    expect(newState.user).toEqual(user);
    expect(newState.isAuthInitialized).toBe(true);
  });

  it('clearUser должен очищать пользователя и ставить isAuthInitialized = true', () => {
    const stateWithUser = {
      user: { id: 1, name: 'Test', email: 'test@mail.com' },
      isAuthInitialized: true,
    };
    const newState = authReducer(stateWithUser, clearUser());

    expect(newState.user).toBeNull();
    expect(newState.isAuthInitialized).toBe(true);
  });

  it('logout должен очищать пользователя, ставить isAuthInitialized = false и удалять токен', () => {
    const stateWithUser = {
      user: { id: 1, name: 'Test', email: 'test@mail.com' },
      isAuthInitialized: true,
    };
    const newState = authReducer(stateWithUser, logout());

    expect(newState.user).toBeNull();
    expect(newState.isAuthInitialized).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
