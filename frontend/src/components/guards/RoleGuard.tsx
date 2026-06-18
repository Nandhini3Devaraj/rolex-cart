'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: boolean;
  redirect?: boolean;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback = false,
  redirect = false,
}: RoleGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isAllowed = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (redirect && user && !isAllowed) {
      router.replace('/unauthorized');
    }
  }, [redirect, user, isAllowed, router]);

  if (!user || !isAllowed) {
    if (redirect) {
      return (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (fallback) {
      return (
        <div className="flex items-center justify-center p-8 min-h-[400px] w-full">
          <div className="glass-panel-glow-pink p-8 rounded-[24px] max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4 border border-pink-500/20">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-pink-400 mb-2">Access Denied</h2>
            <p className="text-slate-300 text-sm mb-4">
              Your role ({user?.role || 'Guest'}) does not have permission to access this page or action.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}
