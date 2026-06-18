import { apiClient, apiCall, mockDb } from './api';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiCall<AuthResponse>(
      async () => {
        const response = await apiClient.post('/auth/login', { email, password });
        const body = response.data;
        // Backend returns { success, token, user }
        return { user: body.user, token: body.token };
      },
      () => {
        const users = mockDb.getUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        if (!user.isActive) {
          throw new Error('Your account has been deactivated. Please contact support.');
        }
        
        // Mock token generation
        const mockToken = `mock-jwt-token-for-${user._id}-${user.role}-${Date.now()}`;
        return { user, token: mockToken };
      }
    );
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return apiCall<AuthResponse>(
      async () => {
        const response = await apiClient.post('/auth/register', { name, email, password });
        const body = response.data;
        return { user: body.user, token: body.token };
      },
      () => {
        const users = mockDb.getUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('User already exists with this email');
        }

        const newUser: User = {
          _id: `u-${Date.now()}`,
          name,
          email,
          role: 'Customer', // Default role for registering users
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockDb.setUsers([...users, newUser]);
        const mockToken = `mock-jwt-token-for-${newUser._id}-${newUser.role}-${Date.now()}`;
        return { user: newUser, token: mockToken };
      }
    );
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignored for offline/mock cases
    }
    return { message: 'Logged out successfully' };
  },
};
