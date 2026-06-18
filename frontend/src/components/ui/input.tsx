import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-all',
          'focus-visible:outline-none focus-visible:border-pink-500/45 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-pink-500/15',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
