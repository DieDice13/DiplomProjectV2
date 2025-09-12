import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect, type MockInstance } from 'vitest';

// 🔇 подавляем console.error в тестах
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

// Импорты после моков
import RegisterForm from './RegisterForm';
import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useFavorites } from '../../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

describe('RegisterForm', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockRegisterUser: ReturnType<typeof vi.fn>;
  let mockNavigate: ReturnType<typeof vi.fn>;
  let mockSyncFavorites: ReturnType<typeof vi.fn>;
  let onRegisterSuccess: ReturnType<typeof vi.fn>;
  const inputClass = (hasError: boolean) => (hasError ? 'error' : 'ok');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockDispatch = vi.fn();
    mockRegisterUser = vi.fn();
    mockNavigate = vi.fn();
    mockSyncFavorites = vi.fn();
    onRegisterSuccess = vi.fn();

    (useAppDispatch as unknown as MockInstance).mockReturnValue(mockDispatch);
    (useMutation as unknown as MockInstance).mockReturnValue([
      mockRegisterUser,
      { loading: false },
    ]);
    (useNavigate as unknown as MockInstance).mockReturnValue(mockNavigate);
    (useFavorites as unknown as MockInstance).mockReturnValue({ syncFavorites: mockSyncFavorites });
  });

  it('рендерит все поля и кнопки', () => {
    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);

    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Введите пароль/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Зарегистрироваться/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /У меня уже есть аккаунт/i })).toBeInTheDocument();
  });

  it('показывает ошибки валидации при пустых полях', async () => {
    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);
    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));

    expect(await screen.findByText(/Имя обязательно/i)).toBeInTheDocument();
    expect(await screen.findByText(/Обязательное поле/i)).toBeInTheDocument();
  });

  it('валидирует email и пароль', async () => {
    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);

    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);

    fireEvent.input(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.blur(emailInput);

    fireEvent.input(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    expect(await screen.findByText(/Некорректная почта/i)).toBeInTheDocument();
    expect(await screen.findByText(/Минимум 6 символов/i)).toBeInTheDocument();
  });

  it('успешная регистрация', async () => {
    mockRegisterUser.mockResolvedValue({
      data: { register: { token: 'abc123', user: { id: 1, name: 'Test User' } } },
    });

    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);

    fireEvent.input(screen.getByPlaceholderText(/Имя/i), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByPlaceholderText(/example@mail.com/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.input(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        variables: { name: 'Test User', email: 'test@mail.com', password: '123456' },
      });
      expect(localStorage.getItem('token')).toBe('abc123');
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
      expect(mockSyncFavorites).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Регистрация прошла успешно');
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
      expect(onRegisterSuccess).toHaveBeenCalled();
    });
  });

  it('ошибка: email занят', async () => {
    mockRegisterUser.mockRejectedValue({
      graphQLErrors: [{ message: 'Email уже используется' }],
    });

    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);

    fireEvent.input(screen.getByPlaceholderText(/Имя/i), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByPlaceholderText(/example@mail.com/i), {
      target: { value: 'taken@mail.com' },
    });
    fireEvent.input(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));

    expect(await screen.findByText(/Email уже используется/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Email уже используется');
  });

  it('ошибка: другая', async () => {
    mockRegisterUser.mockRejectedValue({
      graphQLErrors: [{ message: 'Что-то пошло не так' }],
    });

    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);

    fireEvent.input(screen.getByPlaceholderText(/Имя/i), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByPlaceholderText(/example@mail.com/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.input(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));

    expect(await screen.findByText(/Что-то пошло не так/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Что-то пошло не так');
  });

  it('кнопка "У меня уже есть аккаунт" вызывает onRegisterSuccess', () => {
    render(<RegisterForm onRegisterSuccess={onRegisterSuccess} inputClass={inputClass} />);
    fireEvent.click(screen.getByRole('button', { name: /У меня уже есть аккаунт/i }));
    expect(onRegisterSuccess).toHaveBeenCalled();
  });
});
