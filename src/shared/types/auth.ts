// 认证状态枚举
export enum AuthStatus {
  INITIAL = 'initial',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
  ERROR = 'error'
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
  [resource: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  }
};

// 用户角色枚举
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
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

// 多因素认证状态
export enum MFAStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  SETUP_REQUIRED = 'setup_required',
  VERIFICATION_REQUIRED = 'verification_required'
}

// 多因素认证类型
export enum MFAType {
  APP = 'app',     // 认证应用 (如Google Authenticator)
  SMS = 'sms',     // 短信验证码
  EMAIL = 'email'  // 邮件验证码
}

// 多因素认证信息
export interface MFAInfo {
  enabled: boolean;
  status: MFAStatus;
  preferredMethod?: MFAType;
  methods: {
    [key in MFAType]?: {
      enabled: boolean;
      verified: boolean;
      lastUsed?: string;
    }
  };
}

export interface User {
  id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  phone?: string;
  join_date?: string;
  last_login?: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  mfa?: MFAInfo;
  permissions?: Permission[];
}

export interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  
  updateProfile: (userData: Partial<User>) => Promise<void>;
  
  isAdmin: () => boolean;
  can: (resource: string, action: string) => boolean;

  // 多因素认证相关方法
  setupMFA: (type: MFAType) => Promise<{ secret?: string, qrCode?: string }>;
  verifyMFA: (code: string, type: MFAType) => Promise<boolean>;
  disableMFA: (type: MFAType) => Promise<void>;
  isMFAEnabled: () => boolean;
  getMFAStatus: () => MFAStatus;

  // 新增属性
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterUserData {
  username?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// MFA API请求响应接口
export interface MFAVerifyRequest {
  code: string
  type: MFAType
  userId: string
}

export interface MFASetupRequest {
  type: MFAType
}

export interface MFASetupResponse {
  success: boolean
  type: MFAType
  qrCode?: string
  secret?: string
  message?: string
}

export interface MFADisableRequest {
  type: MFAType
}

export interface MFASendCodeRequest {
  type: MFAType
  userId: string
}

export interface ApiResponse {
  success?: boolean
  error?: string
  message?: string
  details?: string
} 
