'use client';

import React from 'react';
import { WifiOff, AlertCircle, ShieldAlert, Lock } from 'lucide-react';
import GlassButton from './GlassButton';
import Link from 'next/link';

type ErrorType = 'api' | 'network' | 'unauthorized' | 'forbidden';

interface ErrorStateProps {
  type?: ErrorType;
  message?: string;
  retry?: () => void;
}

const ERROR_CONFIG: Record<
  ErrorType,
  { icon: React.ReactNode; title: string; defaultMessage: string }
> = {
  api: {
    icon: <AlertCircle className="w-8 h-8 text-red-400" />,
    title: 'An Error Occurred',
    defaultMessage: 'We encountered a problem fetching the required data. Please try again.',
  },
  network: {
    icon: <WifiOff className="w-8 h-8 text-red-400" />,
    title: 'Network Connection Lost',
    defaultMessage: 'Unable to reach the server. Check your connection and try again.',
  },
  unauthorized: {
    icon: <Lock className="w-8 h-8 text-amber-400" />,
    title: 'Unauthorized',
    defaultMessage: 'You need to sign in to access this resource.',
  },
  forbidden: {
    icon: <ShieldAlert className="w-8 h-8 text-red-400" />,
    title: 'Access Forbidden',
    defaultMessage: 'You do not have permission to perform this action.',
  },
};

export default function ErrorState({ type = 'api', message, retry }: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px] glass-panel rounded-[24px]">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
        {config.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-2">{config.title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        {message || config.defaultMessage}
      </p>
      <div className="flex gap-3">
        {retry && (
          <GlassButton variant="primary" onClick={retry}>
            Try Again
          </GlassButton>
        )}
        {type === 'unauthorized' && (
          <Link href="/login">
            <GlassButton variant="secondary">Sign In</GlassButton>
          </Link>
        )}
        {type === 'forbidden' && (
          <Link href="/unauthorized">
            <GlassButton variant="secondary">View Details</GlassButton>
          </Link>
        )}
      </div>
    </div>
  );
}
