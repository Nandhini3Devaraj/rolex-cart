'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getRouteLabel } from '@/constants/routes';
import { cn } from '@/lib/utils';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const label =
      isLast && segments.length > 0 ? getRouteLabel(pathname) : getRouteLabel(href);

    return { href, label, isLast };
  });

  if (pathname === '/dashboard' || crumbs.length === 0) {
    return (
      <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
        <Home className="w-3.5 h-3.5 text-pink-400/70" />
        <span className="font-semibold text-slate-300">Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs flex-wrap" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="text-slate-500 hover:text-pink-400 transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          {crumb.isLast ? (
            <span className={cn('font-bold text-slate-200')}>{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-slate-500 hover:text-pink-400 transition-colors font-medium">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
