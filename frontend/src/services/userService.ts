import { apiClient, apiCall, mockDb } from './api';
import { User, Role } from '../types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return apiCall<User[]>(
      async () => {
        const { data } = await apiClient.get('/users');
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => mockDb.getUsers()
    );
  },

  createUser: async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password?: string }): Promise<User> => {
    return apiCall<User>(
      async () => {
        const { data } = await apiClient.post('/users', userData);
        return data.data || data;
      },
      () => {
        const users = mockDb.getUsers();
        const newUser: User = {
          _id: `u-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockDb.setUsers([...users, newUser]);
        return newUser;
      }
    );
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return apiCall<User>(
      async () => {
        const { data } = await apiClient.put(`/users/${id}`, userData);
        return data.data || data;
      },
      () => {
        const users = mockDb.getUsers();
        let updatedUser: User | null = null;
        const updatedUsers = users.map((user) => {
          if (user._id === id) {
            updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
            return updatedUser;
          }
          return user;
        });
        if (!updatedUser) throw new Error('User not found');
        mockDb.setUsers(updatedUsers);
        return updatedUser;
      }
    );
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(
      async () => {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
      },
      () => {
        mockDb.setUsers(mockDb.getUsers().filter((u) => u._id !== id));
        return { message: 'User deleted successfully' };
      }
    );
  },

  getUsersByRole: async (role: Role): Promise<User[]> => {
    return apiCall<User[]>(
      async () => {
        const { data } = await apiClient.get(`/users/role/${role}`);
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => mockDb.getUsers().filter((u) => u.role === role)
    );
  },
};
