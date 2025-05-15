import { createClient } from '@supabase/supabase-js';
import { UserInfo, UserRole, Permission } from '@/types/auth';
import { getDefaultPermissionsForRole } from '@/utils/auth';
import { Database } from '@/types/supabase';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建增强型Supabase客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    fetch: (url, options = {}) => {
      // 在开发环境下添加请求日志
      if (process.env.NODE_ENV === 'development') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Supabase请求: ${url.toString().substring(0, 80)}...`);
      }
      
      // 使用原生fetch，添加错误处理
      return fetch(url, options).catch(err => {
        console.error('Supabase请求失败:', err);
        throw err;
      });
    }
  }
});

// Supabase 认证服务
export class SupabaseAuthService {
  // 从 Supabase 获取用户信息
  static async getUserInfo(): Promise<UserInfo | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // 从自定义声明或数据库获取角色和权限
    const role = this.determineUserRole(user);
    const permissions = this.getUserPermissions(role);

    return {
      id: user.id,
      email: user.email || '',
      role,
      permissions
    };
  }

  // 确定用户角色的逻辑
  private static determineUserRole(user: any): UserRole {
    // 可以根据 user.user_metadata 或数据库查询确定角色
    const metadata = user.user_metadata || {};
    
    switch (metadata.role) {
      case 'admin':
        return UserRole.ADMIN;
      default:
        return UserRole.USER;
    }
  }

  // 获取用户权限
  private static getUserPermissions(role: UserRole): Permission[] {
    return getDefaultPermissionsForRole(role);
  }

  // 登录方法
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  // 登出方法
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // 注册方法
  static async signUp(email: string, password: string, role: UserRole = UserRole.USER) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role.toLowerCase()
        }
      }
    });

    if (error) throw error;
    return data;
  }
}

// 检查Supabase配置
export function checkSupabaseConfig() {
  return {
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    url: supabaseUrl ? '已配置' : '未配置',
    key: supabaseAnonKey ? '已配置' : '未配置'
  };
} 