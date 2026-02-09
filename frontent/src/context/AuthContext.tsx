'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { User, AuthContextType, SignupData } from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if token exists in storage on initial load
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      // Try to get the current user to verify the token is valid
      getCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      storage.setJSON(STORAGE_KEYS.USER_DATA, userData);
      return userData;
    } catch {
      // If token is invalid, remove it
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authAPI.signin({ email, password });
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await authAPI.signup({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName
      });
      setUser(response.user);
      setIsAuthenticated(true);
      storage.setJSON(STORAGE_KEYS.USER_DATA, response.user);
    } catch (error) {
      throw error;
    }
  };

  const refreshSession = async () => {
    await getCurrentUser();
  };

  const logout = async () => {
    try {
      await authAPI.signout();
      setUser(null);
      setIsAuthenticated(false);
    } catch {
      // Even if the API call fails, clear local state
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: storage.get(STORAGE_KEYS.AUTH_TOKEN),
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};