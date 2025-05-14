'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { AuthStatus, UserRole, User, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: AuthStatus.UNAUTHENTICATED,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: () => false
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role || UserRole.USER,
            name: userData.name,
            avatar: userData.avatar_url
          })
          setStatus(AuthStatus.AUTHENTICATED)
        } else {
          setStatus(AuthStatus.UNAUTHENTICATED)
        }
      } else {
        setStatus(AuthStatus.UNAUTHENTICATED)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkSession()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setStatus(AuthStatus.UNAUTHENTICATED)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setStatus(AuthStatus.LOADING)
    try {
      console.log('尝试登录:', email)
      
      // 额外的调试信息
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      console.log('Supabase URL:', supabaseUrl)
      console.log('Supabase Anon Key:', supabaseAnonKey ? 'Key存在' : '密钥缺失')

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      console.log('登录返回数据:', data)
      
      if (error) {
        console.error('Supabase登录错误详情:', {
          message: error.message,
          status: error.status,
          code: error.code
        })
        setStatus(AuthStatus.UNAUTHENTICATED)
        throw new Error(`登录失败: ${error.message}`)
      }

      // 额外的用户信息验证
      if (data.user) {
        console.log('用户信息:', {
          id: data.user.id,
          email: data.user.email
        })
      }
    } catch (err) {
      console.error('认证过程发生错误:', err)
      setStatus(AuthStatus.UNAUTHENTICATED)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('退出登录时发生错误:', error)
      // 可以添加错误处理逻辑，如显示通知
    }
  }

  const isAdmin = () => {
    return user?.role === UserRole.ADMIN
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      status, 
      signIn, 
      signOut,
      isAdmin
    }}>
      {status !== AuthStatus.LOADING && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  
  return context
} 