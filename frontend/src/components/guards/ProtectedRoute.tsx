'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#040108] bg-mesh-gradient flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
          <p className="mt-4 text-pink-400/80 font-medium text-sm tracking-widest uppercase">
            Securing Session
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
