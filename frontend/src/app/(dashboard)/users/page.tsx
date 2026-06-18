'use client';

import React, { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import RoleGuard from '@/components/guards/RoleGuard';
import PermissionGuard from '@/components/guards/PermissionGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassTable from '@/components/ui/GlassTable';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';
import Modal from '@/components/ui/Modal';
import { useDashboard } from '@/contexts/DashboardContext';
import { userService } from '@/services/userService';
import { User, Role } from '@/types';
import { Search, UserPlus, Edit2, CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react';

const userSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters').optional().or(zod.literal('')),
  role: zod.enum(['Customer', 'Staff', 'Manager', 'SuperAdmin']),
  isActive: zod.boolean(),
});

type UserFormFields = zod.infer<typeof userSchema>;

const ROLE_COLORS: Record<Role, string> = {
  SuperAdmin: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  Manager:    'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Staff:      'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Customer:   'bg-teal-500/15 text-teal-400 border-teal-500/30',
};

const ROLE_OPTIONS: Role[] = ['Customer', 'Staff', 'Manager', 'SuperAdmin'];

export default function UsersPage() {
  const { users, addUser, updateUser: updateUserContext } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    register: regCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<UserFormFields>({
    resolver: zodResolver(userSchema) as Resolver<UserFormFields>,
    defaultValues: { isActive: true, role: 'Customer' },
  });

  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<UserFormFields>({
    resolver: zodResolver(userSchema) as Resolver<UserFormFields>,
    defaultValues: { isActive: true },
  });

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const onCreateSubmit = async (data: UserFormFields) => {
    setLoading(true);
    try {
      const newUser = await userService.createUser({ name: data.name, email: data.email, password: data.password || 'password123', role: data.role, isActive: data.isActive });
      addUser(newUser);
      setIsCreateOpen(false);
      resetCreate();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (data: UserFormFields) => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const updated = await userService.updateUser(selectedUser._id, { name: data.name, email: data.email, role: data.role, isActive: data.isActive });
      updateUserContext(selectedUser._id, updated);
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    resetEdit({ name: user.name, email: user.email, role: user.role, isActive: user.isActive });
    setIsEditOpen(true);
  };

  const toggleStatus = async (user: User) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;
    setLoading(true);
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      updateUserContext(user._id, { isActive: !user.isActive });
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager']} redirect>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full placeholder-slate-500"
            />
          </div>
          <PermissionGuard permission="create:users">
            <GlassButton
              onClick={() => setIsCreateOpen(true)}
              variant="primary"
              className="w-full sm:w-auto text-xs py-2.5 px-5 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Create User
            </GlassButton>
          </PermissionGuard>
        </div>

        {/* Table */}
        <GlassCard className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No users found{search ? ' matching your search.' : '.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3.5 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      {/* User */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200 leading-tight">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider border uppercase ${ROLE_COLORS[user.role]}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-5 text-[11px] text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <PermissionGuard permission="edit:users">
                            <button
                              onClick={() => openEditModal(user)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold border border-white/8 hover:border-white/15 transition-all cursor-pointer"
                              title="Edit User"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </PermissionGuard>

                          <PermissionGuard permission="toggle:users-status">
                            <button
                              onClick={() => toggleStatus(user)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                user.isActive
                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20 hover:border-amber-500/35'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/35'
                              }`}
                              title={user.isActive ? 'Deactivate user' : 'Activate user'}
                            >
                              {user.isActive
                                ? <><UserX className="w-3 h-3" /> Deactivate</>
                                : <><UserCheck className="w-3 h-3" /> Activate</>
                              }
                            </button>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                  <span className="text-xs text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                  <div className="flex gap-2">
                    <GlassButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} variant="secondary" className="text-xs py-1.5 px-3">
                      Previous
                    </GlassButton>
                    <GlassButton onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} variant="secondary" className="text-xs py-1.5 px-3">
                      Next
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* Create Modal */}
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New User">
          <form onSubmit={handleCreateSubmit(onCreateSubmit)} className="space-y-4">
            <GlassInput label="Full Name" type="text" placeholder="Enter full name" error={createErrors.name?.message} {...regCreate('name')} />
            <GlassInput label="Email Address" type="email" placeholder="user@example.com" error={createErrors.email?.message} {...regCreate('email')} />
            <GlassInput label="Password" type="password" placeholder="••••••••" error={createErrors.password?.message} {...regCreate('password')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Role</label>
              <select className="glass-select w-full px-4 py-2.5 rounded-xl text-sm" {...regCreate('role')}>
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {createErrors.role?.message && <p className="text-red-400 text-xs">{createErrors.role.message}</p>}
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none py-1">
              <input type="checkbox" className="w-4 h-4 rounded accent-pink-500" defaultChecked {...regCreate('isActive')} />
              <span className="text-slate-300 text-xs font-semibold">Account Active</span>
            </label>

            <GlassButton type="submit" variant="primary" className="w-full text-xs mt-2">
              Create User
            </GlassButton>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User">
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <GlassInput label="Full Name" type="text" placeholder="Enter full name" error={editErrors.name?.message} {...regEdit('name')} />
            <GlassInput label="Email Address" type="email" placeholder="user@example.com" error={editErrors.email?.message} {...regEdit('email')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Role</label>
              <select className="glass-select w-full px-4 py-2.5 rounded-xl text-sm" {...regEdit('role')}>
                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {editErrors.role?.message && <p className="text-red-400 text-xs">{editErrors.role.message}</p>}
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none py-1">
              <input type="checkbox" className="w-4 h-4 rounded accent-pink-500" {...regEdit('isActive')} />
              <span className="text-slate-300 text-xs font-semibold">Account Active</span>
            </label>

            <GlassButton type="submit" variant="primary" className="w-full text-xs mt-2">
              Save Changes
            </GlassButton>
          </form>
        </Modal>
      </div>
    </RoleGuard>
  );
}
