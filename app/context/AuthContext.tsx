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
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, useDefaultAvatar?: boolean) => Promise<void>;
  register: (userData: any, useDefaultAvatar?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void; // 添加更新用户信息的方法
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
      // 在实际应用中，这里应该调用API进行身份验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 尝试从用户配置文件中找到匹配的用户
      let existingUserData = null;
      
      if (isBrowser) {
        try {
          const userProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '{}');
          
          // 查找匹配的用户
          Object.values(userProfiles).forEach((profile: any) => {
            if (profile.email === email) {
              existingUserData = profile;
            }
          });
        } catch (err) {
          console.error('Failed to parse user profiles from localStorage:', err);
        }
      }
      
      // 这里模拟API响应 - 为了测试方便，任何邮箱和密码组合都可以登录
      const userData: User = existingUserData || {
        id: '1',
        username: '测试用户',
        email: email || 'test@example.com',
        firstName: '测试',
        lastName: '用户',
        phone: '138****1234', // 添加默认电话号码
        role: 'admin' // 为测试方便，默认所有用户都是管理员
      };
      
      // 如果没有现有数据且明确指定使用默认头像，才添加默认头像
      if (!existingUserData && useDefaultAvatar) {
        userData.avatar = 'https://picsum.photos/id/64/200/200';
      }
      
      setUser(userData);
      saveUserToStorage(userData);
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
      
      // 使用随机ID或自动递增ID
      const newId = Date.now().toString();
      
      // 这里模拟API响应
      const newUser: User = {
        id: newId,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '138****1234', // 添加电话号码
        role: 'user' // 新注册用户默认为普通用户角色
      };
      
      // 只有明确指定使用默认头像时才添加avatar字段
      if (useDefaultAvatar) {
        newUser.avatar = 'https://picsum.photos/id/64/200/200';
      }
      
      setUser(newUser);
      saveUserToStorage(newUser);
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
      // 仅移除当前用户标记，但不删除用户数据
      localStorage.removeItem(CURRENT_USER_KEY);
      // 为兼容性移除旧键
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };
  
  // 更新用户信息方法
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };
  
  // 提供上下文值
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser, // 添加到上下文值中
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