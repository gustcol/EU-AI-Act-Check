import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organization?: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        organization: data.organization,
      });
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
            {t('auth.register')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                {t('auth.name')}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="input"
                {...register('name', {
                  required: t('common.required'),
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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
              <label htmlFor="organization" className="label">
                {t('auth.organization')} ({t('common.optional')})
              </label>
              <input
                id="organization"
                type="text"
                className="input"
                {...register('organization')}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="label">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input"
                {...register('confirmPassword', {
                  required: t('common.required'),
                  validate: (value) =>
                    value === password || t('auth.passwordMismatch'),
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? t('common.loading') : t('auth.register')}
          </button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              {t('auth.login')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
