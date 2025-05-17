'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import { User, Permission, UserRole, AuthStatus } from '@/src/app/(shared)/types/auth'

// 导出共享类型，避免类型冲突
export type { Permission } from '@/src/app/(shared)/types/auth'

// 认证上下文类型
interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  hasPermission: (permission: Permission) => boolean
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  // 检查会话并设置用户
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true)
        
        // 获取当前会话
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        if (session?.user) {
          // 获取用户档案
          const { data, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profileError) {
            console.error('获取用户档案失败:', profileError)
            setUser(null)
          } else if (data) {
            const permissions = Array.isArray(data.permissions) 
              ? data.permissions 
              : getDefaultPermissions(data.role || 'user');
              
            setUser({
              id: data.id,
              email: data.email,
              firstName: data.first_name,
              lastName: data.last_name,
              role: data.role === 'admin' ? 'admin' : 'user',
              avatar: data.avatar_url,
              last_login: data.last_login,
              created_at: data.created_at,
              permissions: permissions
            })
          }
        } else {
          setUser(null)
        }
        
        // 监听认证状态变化
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              // 获取用户档案
              const { data, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()
              
              if (profileError) {
                console.error('获取用户档案失败:', profileError)
                setUser(null)
              } else if (data) {
                const permissions = Array.isArray(data.permissions) 
                  ? data.permissions 
                  : getDefaultPermissions(data.role || 'user');
                  
                setUser({
                  id: data.id,
                  email: data.email,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  role: data.role === 'admin' ? 'admin' : 'user',
                  avatar: data.avatar_url,
                  last_login: data.last_login,
                  created_at: data.created_at,
                  permissions: permissions
                })
              }
            } else {
              setUser(null)
            }
          }
        )
        
        setIsLoading(false)
        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error('认证检查失败:', error)
        setUser(null)
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [])
  
  // 获取角色的默认权限
  const getDefaultPermissions = (role: string): Permission[] => {
    if (role === 'admin') {
      return [
        'READ_PRODUCTS', 
        'WRITE_PRODUCTS',
        'MANAGE_USERS', 
        'VIEW_ORDERS', 
        'MANAGE_ORDERS', 
        'MANAGE_INVENTORY'
      ]
    } else {
      return ['READ_PRODUCTS', 'VIEW_ORDERS']
    }
  }
  
  // 登录
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      setError(error.message || '登录失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // 注册
  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        throw error
      }
      
      if (data.user) {
        // 创建用户档案
        const defaultPermissions = getDefaultPermissions('user');
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role: 'user',
            permissions: defaultPermissions,
            created_at: new Date().toISOString()
          })
        
        if (profileError) {
          console.error('创建用户档案失败:', profileError)
        }
      }
    } catch (error: any) {
      setError(error.message || '注册失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // 登出
  const logout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      setUser(null)
      redirect('/auth/login')
    } catch (error: any) {
      setError(error.message || '登出失败')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 重置密码
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      })
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      setError(error.message || '重置密码失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // 更新用户资料
  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('未授权: 没有用户登录')
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      // 转换数据为数据库字段命名风格
      const profileData: Record<string, any> = {}
      
      if (data.firstName !== undefined) profileData.first_name = data.firstName
      if (data.lastName !== undefined) profileData.last_name = data.lastName
      if (data.avatar !== undefined) profileData.avatar_url = data.avatar
      
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id)
      
      if (error) {
        throw error
      }
      
      // 更新本地用户状态
      setUser(prev => {
        if (!prev) return null
        return { ...prev, ...data }
      })
    } catch (error: any) {
      setError(error.message || '更新资料失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // 检查用户是否拥有特定权限
  const hasPermission = (permission: Permission): boolean => {
    // 如果没有用户登录，返回false
    if (!user) return false
    
    // 如果用户有权限列表，检查是否包含所需权限
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission)
    }
    
    // 如果用户是管理员，默认拥有所有权限
    if (user.role === 'admin') {
      return true
    }
    
    return false
  }
  
  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    hasPermission
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 使用认证上下文的钩子
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 