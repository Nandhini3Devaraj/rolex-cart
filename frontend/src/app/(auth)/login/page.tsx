'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import GlassCard from '../../../components/ui/GlassCard';
import GlassInput from '../../../components/ui/GlassInput';
import GlassButton from '../../../components/ui/GlassButton';
import { Shield, Mail, Lock, User } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Valid email required'),
  password: zod.string().min(6, 'Min 6 characters'),
});

const registerSchema = zod.object({
  name: zod.string().min(2, 'Min 2 characters'),
  email: zod.string().email('Valid email required'),
  password: zod.string().min(6, 'Min 6 characters'),
  confirmPassword: zod.string().min(6, 'Confirm password'),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

type LoginFields = zod.infer<typeof loginSchema>;
type RegisterFields = zod.infer<typeof registerSchema>;
type Tab = 'login' | 'register';

const QUICK_CREDENTIALS = {
  SuperAdmin: { email: 'admin@rolex.com', password: 'password123' },
  Manager: { email: 'manager@rolex.com', password: 'password123' },
  Staff: { email: 'staff@rolex.com', password: 'password123' },
  Customer: { email: 'customer@rolex.com', password: 'password123' },
} as const;

export default function LoginPage() {
  const { login, register: authRegister } = useAuth();
  const [tab, setTab] = useState<Tab>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register: regLogin, handleSubmit: handleLoginSubmit, setValue: setLoginValue, formState: { errors: loginErrors } } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });
  const { register: regRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm<RegisterFields>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginFields) => {
    setLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFields) => {
    setLoading(true);
    setError(null);
    try {
      await authRegister(data.name, data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: keyof typeof QUICK_CREDENTIALS) => {
    setLoginValue('email', QUICK_CREDENTIALS[role].email);
    setLoginValue('password', QUICK_CREDENTIALS[role].password);
  };

  const switchTab = (t: Tab) => { setTab(t); setError(null); };

  return (
    <div className="min-h-screen bg-[#040108] bg-mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="glow-bubble-pink top-[20%] left-[-10%] w-[300px] h-[300px]" />
      <div className="glow-bubble-purple bottom-[15%] right-[-10%] w-[350px] h-[350px]" />
      <div className="w-full max-w-md z-10">
        <GlassCard glow="pink" className="p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mb-4 border border-white/15 shadow-md shadow-pink-500/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 tracking-wider">RoleX Cart</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Multi-Role E-Commerce</p>
          </div>

          <div className="flex rounded-xl bg-white/[0.03] border border-white/8 p-1 mb-6">
            <button onClick={() => switchTab('register')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tab === 'register' ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/15 text-pink-400 border border-pink-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Sign Up</button>
            <button onClick={() => switchTab('login')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tab === 'login' ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/15 text-pink-400 border border-pink-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Sign In</button>
          </div>

          {error && <div className="mb-4 p-3 border border-red-500/20 bg-red-500/10 rounded-xl text-red-400 text-xs font-semibold text-center">{error}</div>}

          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <GlassInput label="Full Name" type="text" placeholder="Your name" icon={<User className="w-4 h-4 text-slate-500" />} error={registerErrors.name?.message} {...regRegister('name')} />
              <GlassInput label="Email" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4 text-slate-500" />} error={registerErrors.email?.message} {...regRegister('email')} />
              <GlassInput label="Password" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4 text-slate-500" />} error={registerErrors.password?.message} {...regRegister('password')} />
              <GlassInput label="Confirm" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4 text-slate-500" />} error={registerErrors.confirmPassword?.message} {...regRegister('confirmPassword')} />
              <p className="text-slate-500 text-[10px]">Account created as <span className="text-teal-400 font-bold">Customer</span>. Contact admin to upgrade.</p>
              <GlassButton type="submit" variant="primary" className="w-full" isLoading={loading}>Create Account</GlassButton>
              <button type="button" onClick={() => switchTab('login')} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors pt-1">Have account? <span className="text-pink-400 font-semibold">Sign in</span></button>
            </form>
          )}

          {tab === 'login' && (
            <>
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <GlassInput label="Email" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4 text-slate-500" />} error={loginErrors.email?.message} {...regLogin('email')} />
                <GlassInput label="Password" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4 text-slate-500" />} error={loginErrors.password?.message} {...regLogin('password')} />
                <GlassButton type="submit" variant="primary" className="w-full" isLoading={loading}>Sign In</GlassButton>
              </form>
              <div className="mt-6 pt-5 border-t border-white/5">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center mb-3">Quick Login (Demo)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(QUICK_CREDENTIALS) as (keyof typeof QUICK_CREDENTIALS)[]).map((role) => {
                    const colors: Record<string, string> = { SuperAdmin: 'bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/15 text-pink-400 hover:border-pink-500/30', Manager: 'bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/15 text-purple-400 hover:border-purple-500/30', Staff: 'bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/15 text-indigo-400 hover:border-indigo-500/30', Customer: 'bg-teal-500/5 hover:bg-teal-500/10 border-teal-500/15 text-teal-400 hover:border-teal-500/30' };
                    return <button key={role} onClick={() => handleQuickLogin(role)} className={`px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${colors[role]}`}>{role === 'SuperAdmin' ? 'Admin' : role}</button>;
                  })}
                </div>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
