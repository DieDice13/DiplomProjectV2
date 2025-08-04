import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../graphql/mutations';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../features/auth/authSlice';

type RegisterFormData = {
  email: string;
  password: string;
  name: string;
};

type RegisterFormProps = {
  onRegisterSuccess: () => void;
  inputClass: (hasError: boolean) => string;
};

const schema = yup.object().shape({
  name: yup.string().required('Имя обязательно'),
  email: yup.string().email('Некорректная почта').required('Обязательное поле'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
});

const RegisterForm = ({ onRegisterSuccess, inputClass }: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const {
    register,
    handleSubmit,
    setError, // ← добавлено
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
      onRegisterSuccess();
    } catch (err: any) {
      const message = err?.graphQLErrors?.[0]?.message || 'Ошибка регистрации';

      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message });
      } else {
        setError('root', { type: 'manual', message });
      }

      console.error('Ошибка при регистрации:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Регистрация</h2>

      <div className="flex flex-col">
        <label>
          Имя<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Имя"
          {...register('name')}
          className={inputClass(!!errors.name)}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

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
        {errors.email && <p className="error-text">{errors.email.message}</p>}
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
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      {errors.root && <p className="text-red-500 text-center text-sm">{errors.root.message}</p>}

      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--site-selector-color)]
    hover:bg-[var(--site-selector-hover)] text-white p-2"
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
