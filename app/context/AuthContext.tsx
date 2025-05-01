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
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
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
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (err) {
            console.error('Failed to parse user from localStorage:', err);
          }
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  // 登录方法
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 在实际应用中，这里应该调用API进行身份验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里模拟API响应
      if (email === 'test@example.com' && password === 'password123') {
        const userData: User = {
          id: '1',
          username: '张三',
          email: 'test@example.com',
          firstName: '三',
          lastName: '张',
          avatar: 'https://picsum.photos/id/64/200/200'
        };
        
        setUser(userData);
        if (isBrowser) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 注册方法
  const register = async (userData: any) => {
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
        lastName: userData.lastName
      };
      
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