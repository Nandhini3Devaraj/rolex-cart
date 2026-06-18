'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: boolean;
  redirect?: boolean;
}

export default function PermissionGuard({
  children,
  permission,
  fallback = false,
  redirect = false,
}: PermissionGuardProps) {
  const { hasPermission, user } = useAuth();
  const router = useRouter();
  const isAllowed = hasPermission(permission);

  useEffect(() => {
    if (redirect && user && !isAllowed) {
      router.replace('/unauthorized');
    }
  }, [redirect, user, isAllowed, router]);

  if (!isAllowed) {
    if (redirect) {
      return (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
        </div>
      );
    }

    if (fallback) {
      return (
        <div className="p-4 border border-pink-500/10 bg-pink-500/5 rounded-xl text-center text-pink-300/80 text-xs font-medium">
          Action unauthorized.
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}
