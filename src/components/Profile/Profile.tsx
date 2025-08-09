import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   console.log(user);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth'); // или куда-то на главную — зависит от UX
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Профиль пользователя</h2>
      <div>
        <p>
          <strong>Имя:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* Добавим позже: смена пароля, история заказов, выход */}
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default Profile;
