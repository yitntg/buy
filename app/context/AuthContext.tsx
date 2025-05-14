'use client'

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useCallback 
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AvatarService } from '@/utils/avatarUtils';
import { 
  AuthStatus, 
  UserRole, 
  User, 
  AuthError, 
  PermissionMap, 
  AuthContextType,
  RegisterUserData,
  MFAStatus,
  MFAType
} from '@/types/auth';

// 导入Supabase类型以修复类型问题
import { AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js';

// 默认权限配置
const DEFAULT_PERMISSIONS: PermissionMap = {
  users: { read: false, write: false, delete: false, admin: false },
  products: { read: false, write: false, delete: false, admin: false }
};

// 角色权限映射
const ROLE_PERMISSIONS: Record<string, PermissionMap> = {
  admin: {
    users: { read: true, write: true, delete: true, admin: true },
    products: { read: true, write: true, delete: true, admin: true }
  },
  user: {
    users: { read: false, write: false, delete: false, admin: false },
    products: { read: true, write: false, delete: false, admin: false }
  }
};

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 权限缓存 - 减少数据库查询
const permissionsCache = new Map<string, { permissions: PermissionMap; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 缓存有效期5分钟

// 错误处理工具 - 增强以处理更多Supabase错误
function handleAuthError(error: any): AuthError {
  const errorMap: Record<string, [string, string]> = {
    // Supabase认证错误
    'auth/invalid-credential': ['INVALID_CREDENTIALS', '用户名或密码错误'],
    'auth/user-disabled': ['USER_DISABLED', '用户已被禁用'],
    'auth/email-already-in-use': ['EMAIL_IN_USE', '邮箱已被注册'],
    'auth/weak-password': ['WEAK_PASSWORD', '密码强度不够'],
    // Supabase具体错误码
    'invalid_credentials': ['INVALID_CREDENTIALS', '用户名或密码错误'],
    'invalid_grant': ['INVALID_CREDENTIALS', '用户名或密码错误'],
    'user_not_found': ['USER_NOT_FOUND', '用户不存在'],
    'email_not_confirmed': ['EMAIL_NOT_CONFIRMED', '邮箱未验证'],
    'password_recovery_expired': ['PASSWORD_RECOVERY_EXPIRED', '密码重置链接已过期'],
    'email_taken': ['EMAIL_IN_USE', '邮箱已被注册'],
    // 其他常见错误
    'network_error': ['NETWORK_ERROR', '网络连接错误，请检查您的网络连接'],
    'invalid_token': ['INVALID_TOKEN', '身份验证已过期，请重新登录'],
    'too_many_requests': ['RATE_LIMITED', '操作过于频繁，请稍后再试'],
    'server_error': ['SERVER_ERROR', '服务器错误，请稍后再试'],
    'invalid_request': ['INVALID_REQUEST', '无效的请求'],
    'email_signup_disabled': ['SIGNUP_DISABLED', '邮箱注册功能已禁用'],
    'unauthorized': ['UNAUTHORIZED', '未授权的操作'],
    'expired_token': ['TOKEN_EXPIRED', '登录已过期，请重新登录'],
    'phone_already_confirmed': ['PHONE_CONFIRMED', '手机号已被验证'],
    'password_too_weak': ['WEAK_PASSWORD', '密码强度不足，请使用更复杂的密码']
  };

  console.error('认证错误:', error);
  
  // 尝试从Supabase错误中获取详细信息
  let errorCode = error.code || '';
  let errorMessage = error.message || '';
  
  if (error.error_description) {
    errorMessage = error.error_description;
  }

  // 网络错误检测
  if (error instanceof TypeError && error.message.includes('fetch')) {
    errorCode = 'network_error';
  }
  
  // 服务器错误检测
  if (error.status >= 500) {
    errorCode = 'server_error';
  }
  
  // 频率限制检测
  if (error.status === 429) {
    errorCode = 'too_many_requests';
  }

  // 授权错误检测
  if (error.status === 401) {
    errorCode = 'unauthorized';
  }

  const [code, message] = errorMap[errorCode] || ['UNKNOWN_ERROR', errorMessage || '发生未知错误'];
  return new AuthError(code, message, AuthStatus.ERROR);
}

// 获取用户权限 - 使用缓存
async function fetchUserPermissions(user: User, supabase: any): Promise<PermissionMap> {
  try {
    // 从缓存中获取权限
    const cachedData = permissionsCache.get(user.id);
    const now = Date.now();
    
    // 如果缓存存在且未过期，则使用缓存
    if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
      console.log('使用权限缓存:', user.id);
      return cachedData.permissions;
    }
    
    console.log('获取权限数据:', user.id);
    
    // 首先尝试从数据库中获取用户的权限配置
    const { data: userPermissions, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id);
    
    let permissions: PermissionMap;
    
    if (!error && userPermissions && userPermissions.length > 0) {
      // 用户有自定义权限，将其转换为PermissionMap格式
      permissions = {};
      
      userPermissions.forEach((perm: any) => {
        // 初始化资源权限
        if (!permissions[perm.resource]) {
          permissions[perm.resource] = { 
            read: false, 
            write: false, 
            delete: false, 
            admin: false 
          };
        }
        
        // 设置相应的操作权限
        if (perm.action && permissions[perm.resource]) {
          // 安全地设置操作权限
          if (perm.action === 'read' || perm.action === 'write' || 
              perm.action === 'delete' || perm.action === 'admin') {
            // 使用类型断言确保类型安全
            const actionKey = perm.action as 'read' | 'write' | 'delete' | 'admin';
            permissions[perm.resource][actionKey] = !!perm.granted;
          }
        }
      });
    } else {
      // 如果没有自定义权限，则使用基于角色的权限
      permissions = ROLE_PERMISSIONS[user.role || 'user'] || DEFAULT_PERMISSIONS;
    }
    
    // 更新缓存
    permissionsCache.set(user.id, { 
      permissions, 
      timestamp: now 
    });
    
    return permissions;
  } catch (error) {
    console.error('获取用户权限失败:', error);
    // 出错时使用默认基于角色的权限
    return ROLE_PERMISSIONS[user.role || 'user'] || DEFAULT_PERMISSIONS;
  }
}

// 类型转换和类型守卫函数
function convertToUser(userData: any): User {
  // 基本验证
  if (!userData || typeof userData !== 'object') {
    throw new Error('无效的用户数据: 数据不是对象');
  }
  
  if (!userData.id) {
    throw new Error('无效的用户数据: 缺少用户ID');
  }
  
  if (!userData.email || typeof userData.email !== 'string' || !userData.email.includes('@')) {
    throw new Error('无效的用户数据: 邮箱格式不正确');
  }

  // 安全地提取和转换字段
  const user: User = {
    id: String(userData.id),
    email: String(userData.email),
    username: userData.username ? String(userData.username) : undefined,
    firstName: userData.firstName ? String(userData.firstName) : undefined,
    lastName: userData.lastName ? String(userData.lastName) : undefined,
    avatar: userData.avatar ? String(userData.avatar) : 
           userData.avatar_url ? String(userData.avatar_url) : undefined,
    role: userData.role === 'admin' ? 'admin' : 'user',
    phone: userData.phone ? String(userData.phone) : undefined,
    join_date: userData.join_date ? String(userData.join_date) : 
               userData.created_at ? String(userData.created_at) : undefined,
    last_login: userData.last_login ? String(userData.last_login) : new Date().toISOString(),
    name: userData.name ? String(userData.name) : undefined,
    avatar_url: userData.avatar_url ? String(userData.avatar_url) : undefined,
    created_at: userData.created_at ? String(userData.created_at) : undefined
  };

  return user;
}

// 密码强度验证
function validatePassword(password: string): { valid: boolean; message: string; score: number } {
  if (!password || password.length < 8) {
    return { valid: false, message: '密码长度必须至少为8个字符', score: 0 };
  }

  let score = 0;
  const checks = [
    { regex: /[a-z]/, points: 1, message: '密码应包含小写字母' },
    { regex: /[A-Z]/, points: 1, message: '密码应包含大写字母' },
    { regex: /[0-9]/, points: 1, message: '密码应包含数字' },
    { regex: /[^a-zA-Z0-9]/, points: 1, message: '密码应包含特殊字符' },
    { regex: /.{12,}/, points: 1, message: '密码长度建议至少12个字符' }
  ];

  const failedChecks = [];
  
  for (const check of checks) {
    if (check.regex.test(password)) {
      score += check.points;
    } else {
      failedChecks.push(check.message);
    }
  }

  // 长度分数 (最多2分)
  const lengthScore = Math.min(2, Math.floor(password.length / 4));
  score += lengthScore;

  // 密码总分为7分
  const isValid = score >= 3; // 至少要达到3分才视为有效
  const message = isValid 
    ? (score >= 5 ? '密码强度很好' : '密码强度一般') 
    : failedChecks.join('，');

  return { valid: isValid, message, score };
}

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [authState, setAuthState] = useState<{
    user: User | null;
    status: AuthStatus;
    error: string | null;
    permissions: PermissionMap;
    loading: boolean;
  }>({
    user: null,
    status: AuthStatus.INITIAL,
    error: null,
    permissions: DEFAULT_PERMISSIONS,
    loading: true
  });

  // 提取 checkAdminStatus 到外部，以便在整个组件中使用
  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data: adminData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('获取用户角色失败:', error);
        return false;
      }

      return adminData?.role === 'admin';
    } catch {
      return false;
    }
  }, [supabase]);

  // 检查用户会话和状态
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('获取用户数据失败:', error);
            setAuthState({
              user: null,
              status: AuthStatus.UNAUTHENTICATED,
              error: '获取用户数据失败',
              permissions: DEFAULT_PERMISSIONS,
              loading: false
            });
            return;
          }

          // 转换用户数据
          const user = convertToUser(userData);
          
          // 获取用户权限
          const permissions = await fetchUserPermissions(user, supabase);

          // 设置认证状态
          setAuthState({
            user,
            status: AuthStatus.AUTHENTICATED,
            error: null,
            permissions,
            loading: false
          });
        } else {
          // 无会话，用户未登录
          setAuthState({
            user: null,
            status: AuthStatus.UNAUTHENTICATED,
            error: null,
            permissions: DEFAULT_PERMISSIONS,
            loading: false
          });
        }
      } catch (error) {
        console.error('检查会话出错:', error);
        setAuthState({
          user: null,
          status: AuthStatus.ERROR,
          error: '检查会话失败',
          permissions: DEFAULT_PERMISSIONS,
          loading: false
        });
      }
    };

    // 执行初始会话检查
    checkSession();

    // 设置认证状态变更监听
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 用户已登录，获取用户详情
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('获取用户数据失败:', error);
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.ERROR,
            error: '获取用户数据失败'
          }));
          return;
        }

        // 转换用户数据
        const user = convertToUser(userData);
        
        // 获取用户权限
        const permissions = await fetchUserPermissions(user, supabase);

        // 更新认证状态
        setAuthState({
          user,
          status: AuthStatus.AUTHENTICATED,
          error: null,
          permissions,
          loading: false
        });
      } else if (event === 'SIGNED_OUT') {
        // 用户已登出
        setAuthState({
          user: null,
          status: AuthStatus.UNAUTHENTICATED,
          error: null,
          permissions: DEFAULT_PERMISSIONS,
          loading: false
        });
      }
    });

    // 组件卸载时清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 登录方法
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('开始登录流程:', { email, rememberMe });
      
      setAuthState(prev => ({
        ...prev,
        status: AuthStatus.LOADING,
        error: null
      }));

      // 在生产环境中，不检查环境变量，假设它们已在Vercel中正确设置
      if (process.env.NODE_ENV !== 'production') {
        // 只在开发环境中记录环境变量状态
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.warn('开发环境警告: Supabase环境变量未设置，请检查.env.local文件');
        } else {
          console.log('Supabase配置检查通过');
        }
      }
      
      // 设置会话持久化
      const sessionOptions = rememberMe ? { sessionStorage: 'local' } : { sessionStorage: 'memory' };
      console.log('会话持久化设置:', sessionOptions);
      
      // 登录
      console.log('执行登录操作...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase登录失败:', error);
        const authError = handleAuthError(error);
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: authError.message
        }));
        throw authError;
      }

      console.log('Supabase登录成功，获取用户数据...');
      
      // 根据rememberMe设置持久化
      if (data?.session) {
        // 刷新会话并按rememberMe设置存储方式
        console.log('设置会话持久化...');
        try {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
        } catch (sessionError) {
          console.error('设置会话失败:', sessionError);
          // 继续执行，因为这不是致命错误
        }
      }

      if (data?.user) {
        // 获取用户详情
        console.log('获取用户详情...');
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('获取用户数据失败:', userError);
          console.error('错误详情:', JSON.stringify(userError));
          
          // 检查表是否存在问题
          if (userError.message && userError.message.includes('does not exist')) {
            console.error('错误: users表可能不存在或权限不足');
            throw new AuthError('DATABASE_ERROR', '数据库配置错误，请联系管理员', AuthStatus.ERROR);
          }
          
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.ERROR,
            error: '获取用户数据失败'
          }));
          throw new AuthError('USER_DATA_ERROR', '获取用户数据失败', AuthStatus.ERROR);
        }

        console.log('用户数据获取成功');
        
        // 转换用户数据
        const user = convertToUser(userData);
        console.log('用户数据转换完成');
        
        // 获取用户权限
        console.log('获取用户权限...');
        const permissions = await fetchUserPermissions(user, supabase);
        console.log('用户权限获取完成');

        // 更新认证状态
        console.log('更新认证状态...');
        setAuthState({
          user,
          status: AuthStatus.AUTHENTICATED,
          error: null,
          permissions,
          loading: false
        });
        console.log('登录流程完成');
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      
      // 确保错误被正确抛出
      if (error instanceof AuthError) {
        throw error;
      } else {
        // 如果不是AuthError，转换为AuthError
        const message = error instanceof Error ? error.message : '未知错误';
        throw new AuthError('UNKNOWN_ERROR', `登录失败: ${message}`, AuthStatus.ERROR);
      }
    }
  };

  // 注册方法
  const register = async (userData: RegisterUserData) => {
    try {
      setAuthState(prev => ({
        ...prev,
        status: AuthStatus.LOADING,
        error: null
      }));

      // 验证密码强度
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: passwordValidation.message
        }));
        throw new AuthError('WEAK_PASSWORD', passwordValidation.message, AuthStatus.ERROR);
      }

      console.log('注册新用户:', userData.email);
      
      // 注册用户
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        console.error('注册失败:', error);
        const authError = handleAuthError(error);
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: authError.message
        }));
        throw authError;
      }

      if (data?.user) {
        console.log('用户注册成功，创建用户资料');
        
        // 创建用户资料
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: userData.email,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'user', // 默认角色
            created_at: new Date().toISOString()
          }]);

        if (profileError) {
          console.error('创建用户资料失败:', profileError);
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.ERROR,
            error: '创建用户资料失败'
          }));
          throw new AuthError('PROFILE_ERROR', '创建用户资料失败', AuthStatus.ERROR);
        }

        // 注册成功后自动登录
        const { data: userProfileData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('获取用户数据失败:', userError);
          setAuthState(prev => ({
            ...prev,
            status: AuthStatus.ERROR,
            error: '获取用户数据失败'
          }));
          return;
        }

        // 转换用户数据
        const user = convertToUser(userProfileData);
        
        // 获取用户权限
        const permissions = await fetchUserPermissions(user, supabase);

        // 更新认证状态
        setAuthState({
          user,
          status: AuthStatus.AUTHENTICATED,
          error: null,
          permissions,
          loading: false
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  };

  // 登出方法
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('登出失败:', error);
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: '登出失败'
        }));
        throw error;
      }

      // 清除用户权限缓存
      if (authState.user?.id) {
        permissionsCache.delete(authState.user.id);
      }

      // 清除认证状态
      setAuthState({
        user: null,
        status: AuthStatus.UNAUTHENTICATED,
        error: null,
        permissions: DEFAULT_PERMISSIONS,
        loading: false
      });

      // 重定向到首页
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  // 更新用户资料
  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!authState.user) {
        throw new AuthError('NOT_AUTHENTICATED', '用户未登录', AuthStatus.UNAUTHENTICATED);
      }

      // 更新用户资料
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', authState.user.id);

      if (error) {
        console.error('更新用户资料失败:', error);
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: '更新用户资料失败'
        }));
        throw new AuthError('UPDATE_PROFILE_ERROR', '更新用户资料失败', AuthStatus.ERROR);
      }

      // 获取更新后的用户资料
      const { data: updatedUserData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authState.user.id)
        .single();

      if (userError) {
        console.error('获取更新后的用户数据失败:', userError);
        setAuthState(prev => ({
          ...prev,
          status: AuthStatus.ERROR,
          error: '获取更新后的用户数据失败'
        }));
        return;
      }

      // 转换用户数据
      const updatedUser = convertToUser(updatedUserData);
      
      // 更新认证状态
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw error;
    }
  };

  // 检查用户是否为管理员
  const isAdmin = () => {
    return authState.user?.role === 'admin';
  };

  // 检查用户是否有权限
  const can = (resource: string, action: string) => {
    if (!authState.user) return false;
    
    const resourcePermissions = authState.permissions[resource];
    if (!resourcePermissions) return false;
    
    return resourcePermissions[action as keyof typeof resourcePermissions] === true;
  };

  // 多因素认证相关方法

  // 设置MFA
  const setupMFA = async (type: MFAType) => {
    try {
      if (!authState.user) {
        throw new AuthError('NOT_AUTHENTICATED', '用户未登录', AuthStatus.UNAUTHENTICATED);
      }

      // 这里是设置MFA的框架代码
      // 实际实现需要根据不同的MFA类型进行处理
      // 例如为APP类型生成TOTP密钥和二维码，为SMS类型验证手机号等

      console.log(`为用户 ${authState.user.id} 设置MFA类型: ${type}`);
      
      // 返回示例数据
      if (type === MFAType.APP) {
        // 对于APP类型，需要返回密钥和二维码
        return {
          secret: 'EXAMPLE_SECRET_KEY',
          qrCode: 'https://example.com/qr-code'
        };
      } else {
        // 对于其他类型，可能不需要返回这些数据
        return {};
      }
    } catch (error) {
      console.error('设置MFA失败:', error);
      throw error;
    }
  };

  // 验证MFA
  const verifyMFA = async (code: string, type: MFAType) => {
    try {
      if (!authState.user) {
        throw new AuthError('NOT_AUTHENTICATED', '用户未登录', AuthStatus.UNAUTHENTICATED);
      }

      // 这里是验证MFA的框架代码
      // 实际实现需要根据不同的MFA类型进行验证
      console.log(`验证用户 ${authState.user.id} 的MFA代码: ${code}, 类型: ${type}`);
      
      // 示例实现，始终返回成功
      return true;
    } catch (error) {
      console.error('验证MFA失败:', error);
      return false;
    }
  };

  // 禁用MFA
  const disableMFA = async (type: MFAType) => {
    try {
      if (!authState.user) {
        throw new AuthError('NOT_AUTHENTICATED', '用户未登录', AuthStatus.UNAUTHENTICATED);
      }

      // 这里是禁用MFA的框架代码
      console.log(`为用户 ${authState.user.id} 禁用MFA类型: ${type}`);
    } catch (error) {
      console.error('禁用MFA失败:', error);
      throw error;
    }
  };

  // 检查MFA是否启用
  const isMFAEnabled = () => {
    return !!authState.user?.mfa?.enabled;
  };

  // 获取MFA状态
  const getMFAStatus = () => {
    return authState.user?.mfa?.status || MFAStatus.DISABLED;
  };

  // 提供上下文值
  const contextValue: AuthContextType = {
    user: authState.user,
    status: authState.status,
    error: authState.error,
    signIn,
    signOut,
    register,
    updateProfile,
    isAdmin,
    can,
    isLoading: authState.loading,
    isAuthenticated: authState.status === AuthStatus.AUTHENTICATED,
    // 多因素认证方法
    setupMFA,
    verifyMFA,
    disableMFA,
    isMFAEnabled,
    getMFAStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于在组件中访问认证上下文
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}

// 管理员认证钩子
export function useAdminAuth() {
  const { user, status, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 若用户不是管理员且认证状态确定，则重定向
    if (status !== AuthStatus.LOADING && status !== AuthStatus.INITIAL) {
      if (!user || !isAdmin()) {
        router.push('/login?redirect=/admin');
      }
    }
  }, [user, status, isAdmin, router]);

  return { user, status, isAdmin: isAdmin() };
} 