import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义中间件处理函数
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname
  
  // 检查是否是管理员路径
  if (path.startsWith('/admin')) {
    // 创建响应头，确保不缓存这些页面
    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, must-revalidate')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    
    // 修改请求以添加这些头部
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  }
  
  // 对于其他路径，不做修改
  return NextResponse.next()
}

// 只对admin路径启用中间件
export const config = {
  matcher: '/admin/:path*',
} 