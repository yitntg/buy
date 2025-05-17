'use client'

import RegisterPageContent from '@/src/app/(shared)/auth/pages/RegisterPage'
import { useEffect } from 'react'

export default function RegisterPage() {
  // 在客户端设置文档标题
  useEffect(() => {
    document.title = '注册 - 乐购商城'
  }, [])

  return <RegisterPageContent />
} 