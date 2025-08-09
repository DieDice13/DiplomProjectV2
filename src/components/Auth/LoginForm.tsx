import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../graphql/mutations/auth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites'; // или скорректируй путь

type LoginFormInputs = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSwitch: () => void;
  inputClass: (hasError: boolean) => string;
};

const loginSchema = Yup.object({
  email: Yup.string().email('Некорректный email').required('Email обязателен'),
  password: Yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
});

const LoginForm = ({ onSwitch, inputClass }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const { syncFavorites } = useFavorites();

  const {
    register,
    handleSubmit,
    setError, // ← добавлено
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

      await syncFavorites(); // ← СИНХРОНИЗАЦИЯ ИЗБРАННЫХ

      toast.success('Успешный вход'); // ← уведомление
      navigate('/profile'); // ← редирект
    } catch (err: any) {
      const message = err?.graphQLErrors?.[0]?.message || 'Ошибка входа';

      if (message.toLowerCase().includes('email') || message.toLowerCase().includes('пароль')) {
        setError('email', { type: 'manual', message });
        setError('password', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }

      toast.error('Ошибка авторизации'); // ← можно и здесь
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-center">Вход</h1>

      <div className="flex flex-col">
        <label>
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="example@mail.com"
          {...register('email')}
          className={inputClass(!!errors.email)}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col">
        <label>
          Пароль<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Введите пароль"
          {...register('password')}
          className={inputClass(!!errors.password)}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm">Ошибка авторизации. Проверьте данные.</p>
      )}

      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--site-selector-color)]
            hover:bg-[var(--site-selector-hover)] p-2 text-white"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <button type="button" onClick={onSwitch} className="text-blue-600 text-sm underline">
          Зарегистрироваться
        </button>

        {errors.root && <p className="text-red-500 text-center text-sm">{errors.root.message}</p>}
      </div>
    </form>
  );
};

export default LoginForm;
