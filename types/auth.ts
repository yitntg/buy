// 认证状态枚举
export enum AuthStatus {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  LOADING = 'loading'
}

// 权限类型
export type Permission = 
  | 'READ_PRODUCTS'
  | 'WRITE_PRODUCTS'
  | 'MANAGE_USERS'
  | 'VIEW_ORDERS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_INVENTORY';

// 角色权限映射
export type PermissionMap = {
  [role in UserRole]: Permission[];
};

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// 自定义认证错误
export class AuthError extends Error {
  constructor(
    public code: string, 
    public message: string, 
    public status: AuthStatus
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// 用户信息接口
export interface UserInfo {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

// 权限检查函数类型
export type PermissionCheckFn = (user: UserInfo, requiredPermission: Permission) => boolean;

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  status: AuthStatus
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: () => boolean
} 