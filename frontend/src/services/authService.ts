import axios from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  VerifyPhoneData
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Temporary mock authentication - in production, this should use proper auth
    try {
      const response = await api.get('/api/users');
      const users = response.data.users || response.data;
      const user = users.find((u: any) => u.email === credentials.email);
      
      if (user && user.password === credentials.password) {
        const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
        localStorage.setItem('accessToken', token);
        
        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            isActive: user.is_active,
          },
          accessToken: token,
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Authentication failed');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Temporary mock registration
    const newUser = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      role: 'user',
      is_active: true,
    };

    try {
      const response = await api.post('/api/users', newUser);
      const user = response.data;
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
      localStorage.setItem('accessToken', token);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isActive: user.is_active,
        },
        accessToken: token,
      };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  async getProfile(): Promise<User> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const tokenData = JSON.parse(atob(token));
      
      // Check if userId exists in token
      if (!tokenData.userId) {
        throw new Error('Invalid token format');
      }
      
      const response = await api.get(`/api/users/${tokenData.userId}`);
      const user = response.data.users?.[0] || response.data;
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error('Failed to get profile');
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const tokenData = JSON.parse(atob(token));
      const updateData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      };
      
      const response = await api.patch(`/api/users/${tokenData.userId}`, updateData);
      const user = response.data;
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
      };
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    // Mock implementation
    return { message: 'Password reset email sent (mock)' };
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    // Mock implementation
    return { message: 'Password reset successful (mock)' };
  },

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    // Mock implementation
    return { message: 'Email verified (mock)' };
  },

  async verifyPhone(data: VerifyPhoneData): Promise<{ message: string }> {
    // Mock implementation
    return { message: 'Phone verified (mock)' };
  },

  async refreshToken(): Promise<AuthResponse> {
    // Mock implementation - just return current token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token to refresh');
    }
    
    const tokenData = JSON.parse(atob(token));
    return {
      user: {
        id: tokenData.userId,
        email: tokenData.email,
        firstName: '',
        lastName: '',
        role: 'user',
        isActive: true,
      },
      accessToken: token,
    };
  },

  logout(): void {
    localStorage.removeItem('accessToken');
  },
};

