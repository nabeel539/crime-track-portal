
import { create } from 'zustand';
import api from '../lib/axios';
import { toast } from 'sonner';

// Define types as JSDoc comments for better IDE support
/**
 * @typedef {'officer' | 'investigator' | 'admin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {string|null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {string|null} error
 * @property {function(string, string): Promise<void>} login
 * @property {function(): void} logout
 * @property {function(): Promise<boolean>} checkAuth
 */

// For the POC, we'll simulate authentication with mock data
const mockUsers = [
  {
    id: '1',
    email: 'officer@crms.com',
    password: 'password123',
    name: 'John Officer',
    role: 'officer',
  },
  {
    id: '2',
    email: 'investigator@crms.com',
    password: 'password123',
    name: 'Jane Investigator',
    role: 'investigator',
  },
  {
    id: '3',
    email: 'admin@crms.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
  },
];

// Generate a mock JWT (not a real JWT, just for simulation)
const generateMockToken = (user) => {
  return `mock-jwt-token-${user.id}-${user.role}-${Date.now()}`;
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For the POC, we'll use mockUsers
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Generate a mock token
      const token = generateMockToken({ 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      });
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }));
      
      // Update state
      set({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      toast.success(`Welcome back, ${user.name}`);
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMsg = 'Failed to login';
      
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Reset state
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    
    toast.info('You have been logged out');
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      // In a real app, this would validate the token with the server
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        set({ isLoading: false });
        return false;
      }
      
      const user = JSON.parse(userStr);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      
      // Clear invalid data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      return false;
    }
  }
}));
