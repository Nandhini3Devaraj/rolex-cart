'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'none' | 'pink' | 'purple';
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className,
  glow = 'none',
  hoverEffect = false,
  ...props
}: GlassCardProps) {
  const glowClass =
    glow === 'pink'
      ? 'glass-panel-glow-pink'
      : glow === 'purple'
      ? 'glass-panel-glow-purple'
      : 'glass-panel';

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('rounded-[24px] overflow-hidden', glowClass, className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
