import axios from 'axios';
import { storage, STORAGE_KEYS } from './storage';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token and redirect to login
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      if (typeof window !== 'undefined' &&
          !window.location.pathname.includes('/signin') &&
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Authentication API functions
export const authAPI = {
  signup: async (userData: { email: string; password: string; first_name?: string; last_name?: string }) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      // Store the token
      if (response.data.access_token) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signin: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/signin', credentials);
      // Store the token
      if (response.data.access_token) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signout: async () => {
    try {
      // Remove the token from storage
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Task API functions
export const taskAPI = {
  getTasks: async (params: { limit?: number; offset?: number; sortBy?: string; sort_by?: string; order?: string; completed?: boolean | null } = {}) => {
    try {
      // Transform camelCase to snake_case for backend compatibility
      const apiParams = {
        limit: params.limit,
        offset: params.offset,
        sort_by: params.sortBy || params.sort_by || 'created_at',
        order: params.order || 'desc',
        completed: params.completed
      };
      const response = await apiClient.get('/tasks', { params: apiParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData: { title: string; description?: string }) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (id: string, taskData: { title?: string; description?: string; is_completed?: boolean }) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  toggleTaskCompletion: async (id: string, isCompleted?: boolean) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}/complete`, isCompleted !== undefined ? { is_completed: isCompleted } : {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};