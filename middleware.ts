import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/src/shared/utils/supabase/server'

// 安全路径配置
const PROTECTED_ROUTES = [
  '/admin',       // 管理员路径
  '/account',     // 用户账户路径
  '/checkout',    // 结账路径
  '/profile',     // 用户资料路径
  '/orders',      // 订单路径
  '/api/secure'   // 安全API路径
]

// 中间件函数，处理请求
export async function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname
  
  // 处理favicon请求，重定向到新位置
  if (path === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/src/shared/assets/favicon.ico', request.url))
  }
  
  // 创建服务端Supabase客户端
  const supabase = createClient()
  
  // 获取并验证会话
  const { data: { session }, error } = await supabase.auth.getSession()
  
  // 检查是否为任何受保护路径
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    path.startsWith(route)
  )
  
  if (isProtectedRoute && (!session || error)) {
    // 会话不存在或验证失败，重定向到登录页面
    // 保存当前URL以便登录后重定向回来
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', path)
    
    return NextResponse.redirect(redirectUrl)
  }
  
  // 专门处理admin路径下的所有请求
  if (path.startsWith('/admin')) {
    if (!session || error) {
      // 会话不存在或验证失败，重定向到登录页面
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url))
    }
    
    // 验证用户是否有管理员权限
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
      
    if (userError || userData?.role !== 'admin') {
      // 用户不是管理员，重定向到无权限页面
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // 设置缓存控制，防止管理页面被缓存
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  }
  
  // MFA校验
  if (session && isProtectedRoute) {
    // 检查用户是否启用了MFA但未完成MFA验证
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('mfa_enabled, mfa_status')
      .eq('id', session.user.id)
      .single()
    
    if (!userError && userData?.mfa_enabled) {
      // 检查MFA cookie是否存在
      const mfaVerified = request.cookies.get('mfa_verified')
      
      // 如果未完成MFA验证，重定向到MFA验证页面
      if (!mfaVerified || mfaVerified.value !== 'true') {
        const redirectUrl = new URL('/auth/mfa', request.url)
        redirectUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }
  
  // 为API路由添加额外的安全头
  if (path.startsWith('/api/')) {
    const response = NextResponse.next()
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    return response
  }
  
  // 添加基本安全头到所有响应
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

// 配置匹配的路径
export const config = {
  // 匹配所有保护路径和API路由，以及favicon
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/api/:path*',
    '/favicon.ico'
  ],
} 