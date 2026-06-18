'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface GlassTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export default function GlassTable({ headers, children, className, ...props }: GlassTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[20px] border border-white/5 bg-white/[0.01]">
      <table className={cn('glass-table', className)} {...(props as any)}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="text-slate-300/80 text-xs font-semibold uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
