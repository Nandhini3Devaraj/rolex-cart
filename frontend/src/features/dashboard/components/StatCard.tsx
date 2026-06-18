'use client';

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  glow?: 'pink' | 'purple' | 'none';
}

export default function StatCard({ label, value, change, icon: Icon, glow = 'none' }: StatCardProps) {
  return (
    <GlassCard glow={glow} hoverEffect className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
          <h3 className="text-2xl font-black text-slate-100 mt-1">{value}</h3>
          {change && (
            <span className="text-pink-400 text-xs font-bold mt-1 block">{change}</span>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlassCard>
  );
}
