import { 
  UserInfo, 
  Permission, 
  UserRole, 
  PermissionMap, 
  AuthStatus, 
  AuthError 
} from '../types/auth';

// 预定义的角色权限映射
export const ROLE_PERMISSIONS: PermissionMap = {
  [UserRole.GUEST]: ['READ_PRODUCTS'],
  [UserRole.CUSTOMER]: [
    'READ_PRODUCTS', 
    'VIEW_ORDERS'
  ],
  [UserRole.SELLER]: [
    'READ_PRODUCTS', 
    'WRITE_PRODUCTS', 
    'VIEW_ORDERS', 
    'MANAGE_INVENTORY'
  ],
  [UserRole.ADMIN]: [
    'READ_PRODUCTS', 
    'WRITE_PRODUCTS', 
    'MANAGE_USERS', 
    'VIEW_ORDERS', 
    'MANAGE_ORDERS', 
    'MANAGE_INVENTORY'
  ]
};

// 检查用户是否具有特定权限
export function checkPermission(
  user: UserInfo, 
  requiredPermission: Permission
): boolean {
  return user.permissions.includes(requiredPermission);
}

// 获取用户角色的默认权限
export function getDefaultPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// 创建安全的权限上下文检查器
export function createPermissionChecker() {
  return {
    can(user: UserInfo, permission: Permission): boolean {
      if (!user) {
        throw new AuthError(
          'NO_USER', 
          '未找到用户', 
          AuthStatus.UNAUTHENTICATED
        );
      }
      return checkPermission(user, permission);
    },
    
    assertCan(user: UserInfo, permission: Permission): void {
      if (!this.can(user, permission)) {
        throw new AuthError(
          'INSUFFICIENT_PERMISSIONS', 
          `用户缺少 ${permission} 权限`, 
          AuthStatus.AUTHENTICATED
        );
      }
    }
  };
}

// 获取用户认证状态
export function getUserAuthStatus(user?: UserInfo | null): AuthStatus {
  if (!user) return AuthStatus.UNAUTHENTICATED;
  
  switch (user.role) {
    case UserRole.ADMIN:
      return AuthStatus.ADMIN;
    case UserRole.GUEST:
      return AuthStatus.UNAUTHENTICATED;
    default:
      return AuthStatus.AUTHENTICATED;
  }
} 