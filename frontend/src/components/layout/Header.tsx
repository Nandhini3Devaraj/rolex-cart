'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { Bell, Search, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassCard from '../ui/GlassCard';
import Breadcrumb from './Breadcrumb';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Generate breadcrumb title from path
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Overview';
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace('-', ' ');
  };

  const mockNotifications = [
    { id: 1, title: 'New Order Received', desc: 'Order #o-103 placed by Jane Customer', time: '5m ago', unread: true },
    { id: 2, title: 'Low Stock Alert', desc: 'Rolex Cosmograph Daytona is down to 5 units', time: '1h ago', unread: true },
    { id: 3, title: 'System Security Audit', desc: 'Super Admin updated role permissions', time: '1d ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-[#03000a]/35 backdrop-blur-md border-b border-white/5 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 lg:hidden transition-colors"
        >
          {/* Menu icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden sm:block">
          <Breadcrumb />
          <h1 className="text-sm font-extrabold text-slate-200 tracking-wide mt-1">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center w-64">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="glass-input pl-10 pr-4 py-2 rounded-xl text-xs w-full placeholder-slate-500"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all select-none cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 relative transition-all select-none cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
              <GlassCard className="absolute right-0 mt-3 w-80 z-50 p-4 border border-white/10 shadow-2xl shadow-black/80">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-pink-400 hover:underline cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'p-2.5 rounded-xl text-left transition-colors',
                        n.unread ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">{n.title}</span>
                        <span className="text-[9px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>

        {/* User Menu Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl hover:bg-white/5 transition-all text-slate-300 hover:text-slate-200 select-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 font-bold text-xs uppercase shadow-sm">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold max-w-[80px] truncate">{user.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <GlassCard className="absolute right-0 mt-3 w-48 z-50 p-2 border border-white/10 shadow-2xl shadow-black/80 flex flex-col gap-0.5">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                    <span className="text-[9px] text-pink-400 uppercase font-extrabold tracking-wider">{user.role}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push('/settings');
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 text-left transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    My Settings
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400/90 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </GlassCard>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
