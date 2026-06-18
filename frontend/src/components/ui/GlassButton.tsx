'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function GlassButton({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  ...props
}: GlassButtonProps) {
  const baseClasses =
    'px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all duration-200';

  const variantClasses = {
    primary: 'glass-button-primary text-white',
    secondary: 'glass-button-secondary text-slate-200 hover:text-white',
    danger: 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 shadow-md',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variantClasses[variant], className)}
      disabled={isLoading || props.disabled}
      {...(props as any)}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}
