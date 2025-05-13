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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setStatus(AuthStatus.UNAUTHENTICATED)
      throw error
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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