import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Globe, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/client';
import { User as UserType } from '../types';

interface ProfileForm {
  name: string;
  organization?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'password'>('profile');

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      organization: user?.organization || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>();

  const newPassword = watchPassword('newPassword');

  const profileMutation = useMutation({
    mutationFn: (data: ProfileForm) => userApi.updateProfile(data),
    onSuccess: (response) => {
      const updatedUser = response.data as UserType;
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const languageMutation = useMutation({
    mutationFn: (language: string) => userApi.updateProfile({ language }),
    onSuccess: (response, language) => {
      const updatedUser = response.data as UserType;
      updateUser(updatedUser);
      i18n.changeLanguage(language);
      toast.success('Language updated successfully');
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordForm) =>
      userApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetPassword();
    },
    onError: () => {
      toast.error('Failed to change password. Check your current password.');
    },
  });

  const tabs = [
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'language' as const, icon: Globe, label: 'Language' },
    { id: 'password' as const, icon: Lock, label: 'Password' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.settings')}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <form onSubmit={handleSubmitProfile((data) => profileMutation.mutate(data))} className="space-y-4">
                <div>
                  <label className="label">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-gray-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="label">{t('auth.name')} *</label>
                  <input
                    {...registerProfile('name', { required: t('common.required') })}
                    className="input"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">{t('auth.organization')}</label>
                  <input
                    {...registerProfile('organization')}
                    className="input"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={profileMutation.isPending}
                    className="btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {profileMutation.isPending ? t('common.loading') : t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Language Preferences</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select your preferred language for the interface.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => languageMutation.mutate(lang.code)}
                    disabled={languageMutation.isPending}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      i18n.language === lang.code
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="block text-sm text-gray-500 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <form
                onSubmit={handleSubmitPassword((data) => passwordMutation.mutate(data))}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="label">Current Password *</label>
                  <input
                    type="password"
                    {...registerPassword('currentPassword', { required: t('common.required') })}
                    className="input"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">New Password *</label>
                  <input
                    type="password"
                    {...registerPassword('newPassword', {
                      required: t('common.required'),
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="input"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">{t('auth.confirmPassword')} *</label>
                  <input
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: t('common.required'),
                      validate: (value) =>
                        value === newPassword || t('auth.passwordMismatch'),
                    })}
                    className="input"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={passwordMutation.isPending}
                    className="btn-primary"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {passwordMutation.isPending ? t('common.loading') : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
