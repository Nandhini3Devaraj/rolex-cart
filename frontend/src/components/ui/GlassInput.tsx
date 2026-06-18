'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function GlassInput({
  label,
  error,
  icon,
  className,
  type,
  ...props
}: GlassInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-slate-300/80 text-xs font-semibold uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-slate-400 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            'glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder-slate-500',
            icon ? 'pl-11' : '',
            isPassword ? 'pr-11' : '',
            error ? 'border-red-500/30 focus:border-red-500/50 focus:shadow-red-500/10' : '',
            className
          )}
          {...(props as any)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400/90 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
