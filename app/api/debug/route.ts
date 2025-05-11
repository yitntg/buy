import { NextResponse } from 'next/server'

export async function GET() {
  // 只收集安全的环境变量信息
  const safeEnvInfo = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelRegion: process.env.VERCEL_REGION,
    // 只显示部分URL以保证安全
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + '...' 
      : undefined,
    // 只显示时间戳和内存使用情况
    serverTime: new Date().toISOString(),
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 + 'MB'
  }

  // 返回简单的JSON响应，不包含敏感数据
  return NextResponse.json({
    status: 'online',
    message: 'Debug API正常工作',
    env: safeEnvInfo
  })
} 