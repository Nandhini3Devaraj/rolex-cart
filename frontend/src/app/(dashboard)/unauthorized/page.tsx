'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full p-4">
      <GlassCard glow="pink" className="p-8 max-w-md text-center border border-white/10 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-100 mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          You do not have the required role privileges or permission clearances to view this page. If you believe this is in error, please contact your Super Admin.
        </p>
        <div className="flex gap-4 justify-center">
          <GlassButton
            onClick={() => router.back()}
            variant="secondary"
            className="text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </GlassButton>
          <GlassButton
            onClick={() => router.push('/dashboard')}
            variant="primary"
            className="text-xs flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Dashboard Home
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
