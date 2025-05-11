import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 中间件函数
export function middleware(request: NextRequest) {
  // 添加性能标记
  const startTime = Date.now()
  
  // 添加超时保护
  console.log(`[中间件] 处理请求: ${request.method} ${request.nextUrl.pathname}`)

  // 添加响应头，禁用客户端缓存
  const response = NextResponse.next({
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'x-middleware-timing': `${Date.now() - startTime}ms`
    }
  })

  return response
}

// 配置匹配路径
export const config = {
  // 匹配除静态页面外的所有路径
  matcher: [
    /*
     * 匹配除静态页面外的所有路径
     * (?!static-only|static-page) - 排除这些路径
     * (?!_next) - 排除Next.js内部路径
     * (?!favicon.ico) - 排除favicon
     */
    '/((?!static-only|static-page|_next|favicon.ico).*)'
  ]
} 