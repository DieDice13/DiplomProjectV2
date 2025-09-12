import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';

// 🔇 глушим console.error, чтобы убрать stderr-логи в тестах
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Моки
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

vi.mock('../../hooks/useAppDispatch', () => ({ useAppDispatch: vi.fn() }));
vi.mock('../../hooks/useFavorites', () => ({ useFavorites: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

// Импорт после моков
import LoginForm from './LoginForm';
import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useFavorites } from '../../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

describe('LoginForm', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockLogin: ReturnType<typeof vi.fn>;
  let mockNavigate: ReturnType<typeof vi.fn>;
  let mockSyncFavorites: ReturnType<typeof vi.fn>;
  let onSwitch: ReturnType<typeof vi.fn>;
  const inputClass = (hasError: boolean) => (hasError ? 'error' : 'ok');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockDispatch = vi.fn();
    mockLogin = vi.fn();
    mockNavigate = vi.fn();
    mockSyncFavorites = vi.fn();
    onSwitch = vi.fn();

    (useAppDispatch as unknown as MockInstance).mockReturnValue(mockDispatch);
    (useMutation as unknown as MockInstance).mockReturnValue([mockLogin, { loading: false }]);
    (useNavigate as unknown as MockInstance).mockReturnValue(mockNavigate);
    (useFavorites as unknown as MockInstance).mockReturnValue({ syncFavorites: mockSyncFavorites });
  });

  it('рендерит все поля и кнопки', () => {
    render(<LoginForm onSwitch={onSwitch} inputClass={inputClass} />);
    expect(screen.getByText(/Вход/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Введите пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Зарегистрироваться/i })).toBeInTheDocument();
  });

  it('валидирует email и пароль', async () => {
    render(<LoginForm onSwitch={onSwitch} inputClass={inputClass} />);

    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);
    const submitButton = screen.getByRole('button', { name: /Войти/i });

    fireEvent.change(emailInput, { target: { value: 'wrong' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveClass('error');
      expect(passwordInput).toHaveClass('error');
    });
  });

  it('успешный вход', async () => {
    mockLogin.mockResolvedValue({
      data: { login: { token: 'token123', user: { id: 1, name: 'Test' } } },
    });

    render(<LoginForm onSwitch={onSwitch} inputClass={inputClass} />);

    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText(/example@mail.com/i), {
        target: { value: 'test@mail.com' },
      });
      fireEvent.input(screen.getByPlaceholderText(/Введите пароль/i), {
        target: { value: '123456' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Войти/i }));
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('token123');
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockSyncFavorites).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Успешный вход');
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('ошибка: неправильный email или пароль', async () => {
    mockLogin.mockRejectedValue({ graphQLErrors: [{ message: 'Неверный email или пароль' }] });

    render(<LoginForm onSwitch={onSwitch} inputClass={inputClass} />);

    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText(/example@mail.com/i), {
        target: { value: 'test@mail.com' },
      });
      fireEvent.input(screen.getByPlaceholderText(/Введите пароль/i), {
        target: { value: '123456' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Войти/i }));
    });

    const errors = await screen.findAllByText(
      (_, element) => element?.textContent?.includes('Неверный email или пароль') ?? false,
    );

    expect(errors.length).toBeGreaterThan(0);
    expect(toast.error).toHaveBeenCalledWith('Ошибка авторизации');
  });

  it('кнопка "Зарегистрироваться" вызывает onSwitch', () => {
    render(<LoginForm onSwitch={onSwitch} inputClass={inputClass} />);
    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));
    expect(onSwitch).toHaveBeenCalled();
  });
});
