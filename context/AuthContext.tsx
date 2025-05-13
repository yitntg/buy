import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import { 
  UserInfo, 
  UserRole, 
  AuthStatus, 
  Permission 
} from '../types/auth';
import { SupabaseAuthService } from '../services/supabaseAuth';
import { createPermissionChecker, getUserAuthStatus } from '../utils/auth';

// 定义 AuthContext 的类型
interface AuthContextType {
  user: UserInfo | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  can: (permission: Permission) => boolean;
}

// 创建 AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.UNAUTHENTICATED);

  // 权限检查器
  const permissionChecker = createPermissionChecker();

  // 检查用户权限的方法
  const can = (permission: Permission): boolean => {
    return user ? permissionChecker.can(user, permission) : false;
  };

  // 登录方法
  const signIn = async (email: string, password: string) => {
    try {
      await SupabaseAuthService.signIn(email, password);
      await refreshUser();
    } catch (error) {
      console.error('登录失败', error);
      throw error;
    }
  };

  // 登出方法
  const signOut = async () => {
    try {
      await SupabaseAuthService.signOut();
      setUser(null);
      setStatus(AuthStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error('登出失败', error);
      throw error;
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string, role?: UserRole) => {
    try {
      await SupabaseAuthService.signUp(email, password, role);
      await refreshUser();
    } catch (error) {
      console.error('注册失败', error);
      throw error;
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const userInfo = await SupabaseAuthService.getUserInfo();
      setUser(userInfo);
      setStatus(getUserAuthStatus(userInfo));
    } catch (error) {
      console.error('获取用户信息失败', error);
      setUser(null);
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  };

  // 初始化用户信息
  useEffect(() => {
    refreshUser();
  }, []);

  // 上下文值
  const contextValue: AuthContextType = {
    user,
    status,
    signIn,
    signOut,
    signUp,
    can
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 Hook 用于使用 AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}; 