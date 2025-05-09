import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 中间件函数
export function middleware(request: NextRequest) {
  // 控制台日志，用于调试
  console.log(`[Middleware] 处理请求: ${request.method} ${request.nextUrl.pathname}`);
  
  // 检查请求路径是否为根路径
  if (request.nextUrl.pathname === '/') {
    // 将根路径请求重定向到产品页
    return NextResponse.redirect(new URL('/products', request.url));
  }
  
  // 返回原始请求，不做修改
  return NextResponse.next();
}

// 配置匹配路径
export const config = {
  // 匹配根路径和API路径
  matcher: ['/', '/api/:path*']
} 