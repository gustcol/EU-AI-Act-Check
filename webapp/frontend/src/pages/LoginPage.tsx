import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('common.appName')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.login')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                {...register('email', {
                  required: t('common.required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                {...register('password', {
                  required: t('common.required'),
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              {t('auth.register')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
