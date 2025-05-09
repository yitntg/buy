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
  phone?: string; // 添加电话号码字段
  join_date?: string; // 加入日期
  last_login?: string; // 最后登录时间
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, useDefaultAvatar?: boolean) => Promise<void>;
  register: (userData: any, useDefaultAvatar?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>; // 更新为异步方法
  error: string | null;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 存储用户列表键名
const USER_STORAGE_KEY = 'user';
const USER_PROFILES_KEY = 'userProfiles';
const CURRENT_USER_KEY = 'currentUser';

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
          // 加载当前用户ID
          const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
          
          if (currentUserId) {
            // 从用户配置文件列表加载用户数据
            const userProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '{}');
            const userData = userProfiles[currentUserId];
            
            if (userData) {
              setUser(userData);
            }
          }
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  // 保存用户到本地存储
  const saveUserToStorage = (userData: User) => {
    if (!isBrowser) return;
    
    try {
      // 保存当前用户ID
      localStorage.setItem(CURRENT_USER_KEY, userData.id);
      
      // 更新用户配置文件列表
      const userProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '{}');
      userProfiles[userData.id] = userData;
      localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(userProfiles));
      
      // 兼容旧版本：保存当前用户到原来的位置
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to save user to localStorage:', err);
    }
  };
  
  // 登录方法
  const login = async (email: string, password: string, useDefaultAvatar = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登录失败');
      }
      
      const data = await response.json();
      const userData = data.user;
      
      // 设置用户状态
      setUser(userData);
      
      // 保存到本地存储
      saveUserToStorage(userData);
      
      console.log('登录成功:', userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试');
      console.error('Login error:', err);
      throw err; // 重新抛出以便调用者处理
    } finally {
      setIsLoading(false);
    }
  };
  
  // 注册方法
  const register = async (userData: any, useDefaultAvatar = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 构建注册数据
      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password || '123456', // 默认密码，实际项目应该要求用户设置密码
        avatar: useDefaultAvatar ? `https://api.dicebear.com/6.x/avataaars/svg?seed=${Date.now()}` : undefined
      };
      
      // 调用注册API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '注册失败');
      }
      
      const data = await response.json();
      const createdUser = data.user;
      
      // 设置用户状态
      setUser(createdUser);
      
      // 保存到本地存储
      saveUserToStorage(createdUser);
      
      console.log('注册成功:', createdUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试');
      console.error('Register error:', err);
      throw err; // 重新抛出以便调用者处理
    } finally {
      setIsLoading(false);
    }
  };
  
  // 退出登录方法
  const logout = () => {
    setUser(null);
    
    if (isBrowser) {
      // 仅移除当前用户标记，但不删除用户数据
      localStorage.removeItem(CURRENT_USER_KEY);
      // 为兼容性移除旧键
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };
  
  // 更新用户信息方法
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 构建更新数据
      const updateData = {
        id: user.id,
        ...userData
      };
      
      // 调用API更新用户资料
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新资料失败');
      }
      
      const data = await response.json();
      const updatedUser = data.user;
      
      // 更新用户状态
      setUser(updatedUser);
      
      // 保存到本地存储
      saveUserToStorage(updatedUser);
      
      console.log('用户资料更新成功:', updatedUser);
    } catch (err) {
      console.error('更新用户资料失败:', err);
      throw err; // 重新抛出以便调用者处理
    } finally {
      setIsLoading(false);
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
    updateUser,
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