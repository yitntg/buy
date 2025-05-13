import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 中间件函数，处理请求
export function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname

  // 专门处理admin路径下的所有请求
  if (path.startsWith('/admin')) {
    // 检查用户是否有管理员权限
    const session = request.cookies.get('sb-access-token')
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 可以进一步验证管理员角色
    // 注意：这里需要解析token或从服务器验证
    
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  }
  
  // 其他路径使用默认处理
  return NextResponse.next()
}

// 配置匹配的路径
export const config = {
  matcher: ['/admin/:path*'],
} 