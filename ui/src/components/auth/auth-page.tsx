import React, { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleAuthSuccess = () => {
    // Redirect will be handled by the router
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">EduFlow</h1>
          <p className="mt-2 text-sm text-gray-600">
            Система управления расписанием
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {mode === 'login' ? (
          <LoginForm 
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess}
            onCancel={() => setMode('login')}
          />
        )}
      </div>

      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-sm text-gray-600">
            Нет аккаунта?{' '}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setMode('register')}
            >
              Зарегистрироваться
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setMode('login')}
            >
              Войти
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
