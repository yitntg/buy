'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, useDefaultAvatar?: boolean) => Promise<void>;
  register: (userData: any, useDefaultAvatar?: boolean) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从本地存储加载用户数据
  useEffect(() => {
    const loadUser = () => {
      if (isBrowser) {
        try {
          const savedUser = localStorage.getItem('user');
          
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  // 登录方法
  const login = async (email: string, password: string, useDefaultAvatar = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 在实际应用中，这里应该调用API进行身份验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里模拟API响应 - 为了测试方便，任何邮箱和密码组合都可以登录
      const userData: User = {
        id: '1',
        username: '测试用户',
        email: email || 'test@example.com',
        firstName: '测试',
        lastName: '用户',
        role: 'admin' // 为测试方便，默认所有用户都是管理员
      };
      
      // 只有明确指定使用默认头像时才添加avatar字段
      if (useDefaultAvatar) {
        userData.avatar = 'https://picsum.photos/id/64/200/200';
      }
      
      setUser(userData);
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 注册方法
  const register = async (userData: any, useDefaultAvatar = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 在实际应用中，这里应该调用API进行注册
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里模拟API响应
      const newUser: User = {
        id: '2',
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user' // 新注册用户默认为普通用户角色
      };
      
      // 只有明确指定使用默认头像时才添加avatar字段
      if (useDefaultAvatar) {
        newUser.avatar = 'https://picsum.photos/id/64/200/200';
      }
      
      setUser(newUser);
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 退出登录方法
  const logout = () => {
    setUser(null);
    if (isBrowser) {
      localStorage.removeItem('user');
    }
  };
  
  // 提供上下文值
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义hook来使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 