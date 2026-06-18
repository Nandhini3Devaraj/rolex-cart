'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import RoleGuard from '@/components/guards/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '@/components/ui/GlassCard';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';
import { User, Lock, BellRing, Settings } from 'lucide-react';

const profileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
});

const passwordSchema = zod
  .object({
    currentPassword: zod.string().min(6, 'Required'),
    newPassword: zod.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFields = zod.infer<typeof profileSchema>;
type PasswordFields = zod.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFields) => {
    setProfileSaving(true);
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Profile updated successfully!');
    setProfileSaving(false);
  };

  const onPasswordSubmit = async (data: PasswordFields) => {
    setPasswordSaving(true);
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Password changed successfully!');
    resetPassword();
    setPasswordSaving(false);
  };

  if (!user) return null;

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Customer']} redirect>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile & Security Fields */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Settings Card */}
        <GlassCard className="p-6">
          <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-pink-400" /> Profile Settings
          </h3>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Full Name"
                type="text"
                error={profileErrors.name?.message}
                {...regProfile('name')}
              />
              <GlassInput
                label="Email Address"
                type="email"
                error={profileErrors.email?.message}
                {...regProfile('email')}
              />
            </div>
            <div className="pt-2">
              <GlassButton type="submit" variant="primary" className="text-xs" isLoading={profileSaving}>
                Save Profile
              </GlassButton>
            </div>
          </form>
        </GlassCard>

        {/* Change Password Card */}
        <GlassCard className="p-6">
          <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-pink-400" /> Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <GlassInput
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.currentPassword?.message}
              {...regPassword('currentPassword')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.newPassword?.message}
                {...regPassword('newPassword')}
              />
              <GlassInput
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.confirmPassword?.message}
                {...regPassword('confirmPassword')}
              />
            </div>
            <div className="pt-2">
              <GlassButton type="submit" variant="primary" className="text-xs" isLoading={passwordSaving}>
                Update Password
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Preferences / Notifications Settings */}
      <div>
        <GlassCard className="p-6">
          <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <BellRing className="w-4.5 h-4.5 text-pink-400" /> Notification Options
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-white/[0.01] rounded-xl transition-colors">
              <input type="checkbox" id="emailNotif" defaultChecked className="mt-1 cursor-pointer" />
              <label htmlFor="emailNotif" className="text-xs cursor-pointer select-none">
                <span className="font-bold text-slate-200 block">Email Notifications</span>
                <span className="text-slate-400 mt-1 block">Receive email digests for summary actions.</span>
              </label>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-white/[0.01] rounded-xl transition-colors">
              <input type="checkbox" id="orderUpdates" defaultChecked className="mt-1 cursor-pointer" />
              <label htmlFor="orderUpdates" className="text-xs cursor-pointer select-none">
                <span className="font-bold text-slate-200 block">Order Status Updates</span>
                <span className="text-slate-400 mt-1 block">Get notified when a delivery milestone changes.</span>
              </label>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-white/[0.01] rounded-xl transition-colors">
              <input type="checkbox" id="securityAlerts" defaultChecked className="mt-1 cursor-pointer" />
              <label htmlFor="securityAlerts" className="text-xs cursor-pointer select-none">
                <span className="font-bold text-slate-200 block">Security & Audits</span>
                <span className="text-slate-400 mt-1 block">Receive warnings on role modifications or key updates.</span>
              </label>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
    </RoleGuard>
  );
}
