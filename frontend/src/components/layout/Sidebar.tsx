'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION_ITEMS } from '../../constants';
import { cn } from '../../lib/utils';
import {
  LayoutGrid,
  Users,
  Activity,
  FolderKanban,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  UserCircle,
  Heart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

// Icon Mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutGrid,
  Users,
  Activity,
  FolderKanban,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  UserCircle,
  Heart,
};

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Filter items by role
  const visibleItems = NAVIGATION_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-45 flex flex-col bg-[#0d0816]/75 backdrop-blur-2xl border-r border-white/5 transition-all duration-300 ease-in-out lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-pink-500/10 border border-white/10">
              <Shield className="w-5 h-5 text-white animate-pulse" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 text-lg tracking-wider select-none">
                ROLEX CART
              </span>
            )}
          </div>
          
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon] || Package;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group select-none',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/15 to-purple-600/10 text-pink-400 border-l-2 border-pink-500 shadow-inner'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
                    isActive ? 'text-pink-500' : 'text-slate-400 group-hover:text-slate-300'
                  )}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout at bottom */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          {!isCollapsed ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold uppercase shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-slate-200 truncate">{user.name}</h4>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-md font-extrabold tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase mt-0.5">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/15 transition-all select-none cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold uppercase text-xs">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/15 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
