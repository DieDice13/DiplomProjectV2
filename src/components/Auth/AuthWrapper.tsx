import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(prev => !prev);

  const inputClass = (hasError: boolean) =>
    `px-3 py-2 border rounded-md outline-none transition ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } focus:border-blue-500`;

  return (
    <div className="py-8 px-4 max-w-md mx-auto ">
      {isLogin ? (
        <LoginForm onSwitch={toggleForm} inputClass={inputClass} />
      ) : (
        <RegisterForm onRegisterSuccess={toggleForm} inputClass={inputClass} />
      )}
    </div>
  );
};

export default AuthWrapper;
