import { createClient } from '@supabase/supabase-js';
import { UserInfo, UserRole, Permission } from '../types/auth';
import { getDefaultPermissionsForRole } from '../utils/auth';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      case 'seller':
        return UserRole.SELLER;
      case 'customer':
        return UserRole.CUSTOMER;
      default:
        return UserRole.GUEST;
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
  static async signUp(email: string, password: string, role: UserRole = UserRole.CUSTOMER) {
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