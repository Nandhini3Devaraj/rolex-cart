'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Role, Permission } from '../types';
import { authService } from '../services/authService';
import { ROLE_PERMISSIONS } from '../constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load session on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('rolex-token');
      const storedUser = localStorage.getItem('rolex-user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('rolex-token');
          localStorage.removeItem('rolex-user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rolex-token', data.token);
      localStorage.setItem('rolex-user', JSON.stringify(data.user));
      
      const redirectPath =
        data.user.role === 'Customer' ? '/dashboard' : '/dashboard';
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rolex-token', data.token);
      localStorage.setItem('rolex-user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout().finally(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('rolex-token');
      localStorage.removeItem('rolex-user');
      router.push('/login');
    });
  };

  const hasRole = (allowedRoles: Role[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
