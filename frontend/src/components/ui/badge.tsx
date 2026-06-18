import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-pink-500/20 bg-pink-500/10 text-pink-400',
        secondary: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
        success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
        warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
        destructive: 'border-red-500/20 bg-red-500/10 text-red-400',
        outline: 'border-white/10 text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
