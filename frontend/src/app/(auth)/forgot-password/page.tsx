'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import GlassCard from '../../../components/ui/GlassCard';
import GlassInput from '../../../components/ui/GlassInput';
import GlassButton from '../../../components/ui/GlassButton';
import { Shield, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
});

type Fields = zod.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
            <h1 className="text-xl font-bold text-slate-200">Forgot Password</h1>
            <p className="text-slate-400 text-xs mt-2">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="p-4 border border-pink-500/10 bg-pink-500/5 rounded-2xl text-slate-300 text-sm leading-relaxed">
                A password reset link has been sent to your email. Please check your inbox and spam folder.
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <GlassInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={<Mail className="w-4.5 h-4.5 text-slate-500" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <GlassButton type="submit" variant="primary" className="w-full" isLoading={loading}>
                Send Reset Link
              </GlassButton>

              <div className="text-center">
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
