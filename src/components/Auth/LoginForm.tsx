import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../graphql/mutations/auth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from './authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import FormField from '../forms/FormField';

type LoginFormInputs = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSwitch: () => void;
  inputClass: (hasError: boolean) => string;
};

// схема валидации для Yup
const loginSchema = Yup.object({
  email: Yup.string().email('Некорректный email').required('Email обязателен'),
  password: Yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
});

const LoginForm = ({ onSwitch, inputClass }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const { syncFavorites } = useFavorites();

  // инициализация useForm с yup-валидатором
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login({ variables: data });
      const { token, user } = response.data.login;

      localStorage.setItem('token', token);
      dispatch(setUser(user));

      await syncFavorites();

      toast.success('Успешный вход');
      navigate('/profile');
    } catch (err: any) {
      // обработка ошибок: либо конкретные поля, либо общая
      const message = err?.graphQLErrors?.[0]?.message || 'Ошибка входа';

      if (message.toLowerCase().includes('email') || message.toLowerCase().includes('пароль')) {
        setError('email', { type: 'manual', message });
        setError('password', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }

      toast.error('Ошибка авторизации');
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-center">Вход</h1>

      {/* Email */}
      <FormField label="Email" required error={errors.email?.message}>
        <input
          type="email"
          placeholder="example@mail.com"
          {...register('email')}
          className={inputClass(!!errors.email)}
        />
      </FormField>

      {/* Пароль */}
      <FormField label="Пароль" required error={errors.password?.message}>
        <input
          type="password"
          placeholder="Введите пароль"
          {...register('password')}
          className={inputClass(!!errors.password)}
        />
      </FormField>

      {/* глобальная ошибка авторизации */}
      {error && (
        <p className="text-red-500 text-center text-sm">Ошибка авторизации. Проверьте данные.</p>
      )}

      {/* кнопки */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--site-selector)] hover:bg-[var(--site-selector-hover)] p-2 text-white"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <button type="button" onClick={onSwitch} className="text-blue-600 text-sm underline">
          Зарегистрироваться
        </button>

        {/* выводим root-ошибку (например, если сервер вернул 500) */}
        {errors.root && <p className="text-red-500 text-center text-sm">{errors.root.message}</p>}
      </div>
    </form>
  );
};

export default LoginForm;
