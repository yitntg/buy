import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查当前会话
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '认证错误');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : '登录失败';
      setError(errorMessage);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : '登出失败';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : '注册失败';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : '更新用户信息失败';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signOut,
    register,
    updateUser,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 