'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import GlassCard from '../../../components/ui/GlassCard';
import GlassInput from '../../../components/ui/GlassInput';
import GlassButton from '../../../components/ui/GlassButton';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const schema = zod
  .object({
    password: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Fields = zod.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Fields) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#040108] bg-mesh-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="glow-bubble-pink top-[20%] left-[-10%] w-[300px] h-[300px]" />
      <div className="glow-bubble-purple bottom-[15%] right-[-10%] w-[350px] h-[350px]" />

      <div className="w-full max-w-md z-10">
        <GlassCard glow="purple" className="p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mb-4 border border-white/15 shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-200">Reset Password</h1>
            <p className="text-slate-400 text-xs mt-2">Enter your new secure password below.</p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="p-4 border border-pink-500/10 bg-pink-500/5 rounded-2xl text-slate-300 text-sm leading-relaxed">
                Password reset successfully! Redirecting you to the login page...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <GlassInput
                label="New Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4.5 h-4.5 text-slate-500" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <GlassInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4.5 h-4.5 text-slate-500" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <GlassButton type="submit" variant="primary" className="w-full" isLoading={loading}>
                Reset Password
              </GlassButton>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
