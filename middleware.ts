import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 中间件函数
export function middleware(request: NextRequest) {
  // 控制台日志，用于调试
  console.log(`[Middleware] 处理请求: ${request.method} ${request.nextUrl.pathname}`);
  
  // 返回原始请求，不做修改
  return NextResponse.next();
}

// 配置匹配路径
export const config = {
  // 只匹配API路由
  matcher: '/api/:path*'
} 