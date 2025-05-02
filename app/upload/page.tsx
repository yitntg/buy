'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function UploadRedirectPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  // 检查认证状态和管理员权限，重定向到相应页面
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (user?.role === 'admin') {
      router.push('/admin/products/new')
    } else {
      router.push('/')
    }
  }, [isAuthenticated, user, router])
  
  // 显示加载中状态
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>正在跳转到管理后台...</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 