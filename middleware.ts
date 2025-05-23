import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 中间件函数，处理请求
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname

  // 专门处理admin路径下的所有请求
  if (path.startsWith('/admin')) {
    // 检查用户是否有认证Cookie
    const authCookie = request.cookies.get('currentUser')
    
    // 创建响应对象
    const response = NextResponse.next()
    
    // 设置缓存控制头，确保admin页面始终是动态的
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    // 如果是管理员页面但没有认证Cookie，可以选择重定向到登录页面
    // 但在这里我们仅设置缓存头，让客户端代码处理认证重定向
    // 这样避免循环重定向问题
    
    return response
  }
  
  // 其他路径使用默认处理
  return NextResponse.next()
}

// 配置匹配的路径
export const config = {
  matcher: ['/admin/:path*'],
} 