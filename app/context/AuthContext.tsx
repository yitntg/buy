'use client'

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useCallback 
} from 'react';
import { createClient } from '@supabase/supabase-js';
import { AvatarService } from '@/utils/avatarUtils';

// 认证状态枚举
export enum AuthStatus {
  INITIAL = 'initial',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// 权限枚举
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'
}

// 权限映射类型
export interface PermissionMap {
  [resource: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  }
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  phone?: string;
  join_date?: string;
  last_login?: string;
}

// 认证错误类
export class AuthError extends Error {
  constructor(
    public code: string, 
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Supabase 客户端初始化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 默认权限配置
const DEFAULT_PERMISSIONS: PermissionMap = {
  users: {
    read: false,
    write: false,
    delete: false,
    admin: false
  },
  products: {
    read: false,
    write: false,
    delete: false,
    admin: false
  }
};

// 角色权限映射
const ROLE_PERMISSIONS: Record<string, PermissionMap> = {
  admin: {
    users: { read: true, write: true, delete: true, admin: true },
    products: { read: true, write: true, delete: true, admin: false }
  },
  user: {
    users: { read: false, write: false, delete: false, admin: false },
    products: { read: true, write: false, delete: false, admin: false }
  }
};

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  
  // 认证方法
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // 权限方法
  can: (resource: string, action: string) => boolean;
  getPermissions: () => PermissionMap;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 获取用户权限
async function fetchUserPermissions(user: User): Promise<PermissionMap> {
  // 根据用户角色获取权限
  const rolePermissions = ROLE_PERMISSIONS[user.role || 'user'] || DEFAULT_PERMISSIONS;
  return rolePermissions;
}

// 错误处理工具
function handleAuthError(error: any): AuthError {
  const errorMap: Record<string, [string, string]> = {
    'auth/invalid-credential': ['INVALID_CREDENTIALS', '用户名或密码错误'],
    'auth/user-disabled': ['USER_DISABLED', '用户已被禁用'],
    'auth/email-already-in-use': ['EMAIL_IN_USE', '邮箱已被注册'],
    'auth/weak-password': ['WEAK_PASSWORD', '密码强度不够']
  };

  const [code, message] = errorMap[error.code] || ['UNKNOWN_ERROR', '发生未知错误'];
  return new AuthError(code, message);
}

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: User | null;
    status: AuthStatus;
    error: string | null;
    permissions: PermissionMap;
  }>({
    user: null,
    status: AuthStatus.INITIAL,
    error: null,
    permissions: DEFAULT_PERMISSIONS
  });

  // 权限检查方法
  const can = useCallback((resource: string, action: string) => {
    const permissions = authState.permissions[resource];
    return permissions ? permissions[action] : false;
  }, [authState.permissions]);

  // 登录方法
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        status: AuthStatus.INITIAL,
        error: null 
      }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw handleAuthError(error);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id)
        .single();

      if (userError) throw handleAuthError(userError);

      const permissions = await fetchUserPermissions(userData);

      setAuthState({
        user: userData,
        status: AuthStatus.AUTHENTICATED,
        error: null,
        permissions
      });
    } catch (error) {
      setAuthState({
        user: null,
        status: AuthStatus.UNAUTHENTICATED,
        error: error instanceof AuthError ? error.message : '登录失败',
        permissions: DEFAULT_PERMISSIONS
      });
      throw error;
    }
  };

  // 注册方法
  const register = async (userData: Partial<User>, password: string) => {
    try {
      setAuthState(prev => ({ 
        ...prev, 
        status: AuthStatus.INITIAL,
        error: null 
      }));
      
      // 注册认证用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password
      });

      if (authError) throw handleAuthError(authError);

      // 在 users 表中创建用户记录
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar || AvatarService.getDefaultAvatarUrl(userData.username!),
          role: 'user'
        })
        .select()
        .single();

      if (userError) throw handleAuthError(userError);

      const permissions = await fetchUserPermissions(userRecord);

      setAuthState({
        user: userRecord,
        status: AuthStatus.AUTHENTICATED,
        error: null,
        permissions
      });
    } catch (error) {
      setAuthState({
        user: null,
        status: AuthStatus.UNAUTHENTICATED,
        error: error instanceof AuthError ? error.message : '注册失败',
        permissions: DEFAULT_PERMISSIONS
      });
      throw error;
    }
  };

  // 退出登录方法
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        status: AuthStatus.UNAUTHENTICATED,
        error: null,
        permissions: DEFAULT_PERMISSIONS
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 更新用户信息方法
  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (error) throw handleAuthError(error);

      setAuthState(prev => ({
        ...prev,
        user: data
      }));
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  };

  // 获取权限方法
  const getPermissions = () => authState.permissions;

  // 提供上下文值
  const value = {
    user: authState.user,
    status: authState.status,
    error: authState.error,
    login,
    register,
    logout,
    updateUser,
    can,
    getPermissions
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

// 管理员权限检查钩子
export function useAdminAuth() {
  const { user, status } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = status === AuthStatus.AUTHENTICATED;
  
  return {
    isAdmin,
    isAuthenticated,
    user
  };
} 