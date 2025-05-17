'use client'

import LoginPageContent from '@/src/app/(shared)/auth/pages/LoginPage'
import { useEffect } from 'react'

export default function LoginPage() {
  // 在客户端设置文档标题
  useEffect(() => {
    document.title = '登录 - 乐购商城'
  }, [])

  return <LoginPageContent />
} 