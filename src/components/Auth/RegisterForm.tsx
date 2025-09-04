import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../graphql/mutations/auth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from './authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import FormField from '../forms/FormField';

type RegisterFormData = {
  email: string;
  password: string;
  name: string;
};

type RegisterFormProps = {
  onRegisterSuccess: () => void; // коллбэк для переключения на форму логина
  inputClass: (hasError: boolean) => string; // функция для генерации классов input
};

// схема валидации через Yup
const schema = yup.object().shape({
  name: yup.string().required('Имя обязательно'),
  email: yup.string().email('Некорректная почта').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
});

const RegisterForm = ({ onRegisterSuccess, inputClass }: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const [registerUser, { loading }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();
  const { syncFavorites } = useFavorites();

  // инициализация react-hook-form с yup-валидатором
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({ variables: data });
      const { token, user } = result.data.register;

      localStorage.setItem('token', token);
      dispatch(setUser(user));

      await syncFavorites();

      toast.success('Регистрация прошла успешно');
      navigate('/profile');

      onRegisterSuccess();
    } catch (err: any) {
      // обработка ошибок (например, занятый email)
      const message = err?.graphQLErrors?.[0]?.message || 'Ошибка регистрации';

      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }

      toast.error('Ошибка регистрации');
      console.error('Ошибка при регистрации:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Регистрация</h2>

      {/* Имя */}
      <FormField label="Имя" required error={errors.name?.message}>
        <input
          type="text"
          placeholder="Имя"
          {...register('name')}
          className={inputClass(!!errors.name)}
        />
      </FormField>

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

      {/* глобальная ошибка (например, email уже занят) */}
      {errors.root && <p className="text-red-500 text-center text-sm">{errors.root.message}</p>}

      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--site-selector)] hover:bg-[var(--site-selector-hover)] text-white p-2"
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <button
          type="button"
          onClick={onRegisterSuccess}
          className="text-blue-600 text-sm underline"
        >
          У меня уже есть аккаунт
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
