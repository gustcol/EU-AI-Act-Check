import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/client';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; organization?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Load auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set language from user preferences
        if (parsedUser.language) {
          i18n.changeLanguage(parsedUser.language);
        }
      } catch {
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, [i18n]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { user: userData, token: authToken } = response.data as AuthResponse;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set user language
      if (userData.language) {
        i18n.changeLanguage(userData.language);
      }

      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('auth.invalidCredentials'));
      throw error;
    }
  }, [navigate, t, i18n]);

  const register = useCallback(async (data: { email: string; password: string; name: string; organization?: string }) => {
    try {
      const response = await authApi.register(data);
      const { user: userData, token: authToken } = response.data as AuthResponse;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success(t('auth.registerSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('auth.emailExists'));
      throw error;
    }
  }, [navigate, t]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('auth.logoutSuccess'));
    navigate('/login');
  }, [navigate, t]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
