// Core entity types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Form data types
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
}

// API response types
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

// UI state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export type TaskFilter = 'all' | 'active' | 'completed';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// API client types
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiError extends Error {
  statusCode: number;
  response?: ErrorResponse;
}

// Helper type for axios errors
export interface AxiosError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
  message: string;
}
