import { Permission } from '@/app/context/AuthContext';

// 资源权限映射
export const RESOURCE_PERMISSIONS: Record<string, Permission[]> = {
  'admin': [Permission.ADMIN, Permission.READ, Permission.WRITE, Permission.DELETE],
  'products': [Permission.READ, Permission.WRITE],
  'users': [Permission.READ, Permission.WRITE],
  'orders': [Permission.READ]
};

// 权限检查工具
export class PermissionService {
  /**
   * 检查用户是否具有特定权限
   * @param userPermissions 用户权限列表
   * @param requiredPermission 所需权限
   * @returns 是否有权限
   */
  static hasPermission(
    userPermissions: Permission[], 
    requiredPermission: Permission
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  /**
   * 检查用户对特定资源是否有权限
   * @param userPermissions 用户权限列表
   * @param resource 资源名称
   * @param requiredPermission 所需权限
   * @returns 是否有资源权限
   */
  static hasResourcePermission(
    userPermissions: Permission[], 
    resource: string, 
    requiredPermission: Permission
  ): boolean {
    const resourcePermissions = RESOURCE_PERMISSIONS[resource] || [];
    return resourcePermissions.includes(requiredPermission) && 
           userPermissions.includes(requiredPermission);
  }

  /**
   * 获取用户对资源的最高权限
   * @param userPermissions 用户权限列表
   * @param resource 资源名称
   * @returns 最高权限
   */
  static getHighestResourcePermission(
    userPermissions: Permission[], 
    resource: string
  ): Permission | null {
    const resourcePermissions = RESOURCE_PERMISSIONS[resource] || [];
    const availablePermissions = resourcePermissions
      .filter((perm: Permission) => userPermissions.includes(perm))
      .sort((a: Permission, b: Permission) => {
        const permOrder = [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN];
        return permOrder.indexOf(b) - permOrder.indexOf(a);
      });
    
    return availablePermissions[0] || null;
  }
} 