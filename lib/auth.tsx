import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, AuthError } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  error: string | null;
  isAdmin: () => boolean;
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
        const { data } = await supabase.auth.getSession();
        const userData = data.session?.user;
        
        // 检查是否为管理员
        if (userData) {
          const { data: adminData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userData.id);

          if (roleError) {
            console.error('获取用户角色失败:', roleError);
          }

          // 在用户元数据中添加管理员标记
          userData.user_metadata = {
            ...userData.user_metadata,
            isAdmin: adminData && adminData.length > 0 ? adminData[0].role === 'admin' : false
          };
        }

        setUser(userData ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '认证错误');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const userData = session?.user;
      
      // 检查是否为管理员
      if (userData) {
        supabase
          .from('users')
          .select('role')
          .eq('id', userData.id)
          .then(({ data: adminData, error: roleError }) => {
            if (roleError) {
              console.error('获取用户角色失败:', roleError);
            }

            // 在用户元数据中添加管理员标记
            userData.user_metadata = {
              ...userData.user_metadata,
              isAdmin: adminData && adminData.length > 0 ? adminData[0].role === 'admin' : false
            };

            setUser(userData);
          });
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // 检查是否为管理员
      if (data.user) {
        const { data: adminData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id);

        if (roleError) {
          console.error('获取用户角色失败:', roleError);
        }

        // 在用户元数据中添加管理员标记
        data.user.user_metadata = {
          ...data.user.user_metadata,
          isAdmin: adminData && adminData.length > 0 ? adminData[0].role === 'admin' : false
        };
      }
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
    error,
    isAdmin: () => !!user && user.user_metadata?.isAdmin === true
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 