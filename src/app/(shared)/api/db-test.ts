import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 无需缓存，始终获取最新状态
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('数据库连接测试API被调用')
  const results: any = {
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      status: 'pending',
      message: '测试中...'
    },
    diagnostics: {
      url: checkEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: checkEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
      serviceKey: checkEnvironmentVariable('SUPABASE_SERVICE_ROLE_KEY', true)
    }
  }

  try {
    // 1. 测试环境变量是否存在
    await runTest(results, '环境变量测试', async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL 环境变量未设置')
      if (!key) throw new Error('未设置任何Supabase密钥')
      
      return {
        url: maskString(url),
        hasKey: !!key
      }
    })

    // 2. 测试Supabase客户端创建
    let supabase: SupabaseClient | null = null
    await runTest(results, 'Supabase客户端创建', async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      
      supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      })
      
      return { 
        clientCreated: !!supabase,
        url: url.substring(0, 12) + '...'
      }
    })

    // 3. 测试Ping连接
    await runTest(results, 'Supabase Ping测试', async () => {
      // 简单检查域名是否可访问
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!url) throw new Error('无法测试Ping：URL未设置')
      
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      return {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      }
    })

    // 4. 测试数据查询
    if (supabase) {
      await runTest(results, '数据库查询测试', async () => {
        // 尝试查询products表
        const { data, error } = await supabase!
          .from('products')
          .select('id')
          .limit(1)
        
        if (error) throw error
        
        return {
          success: true,
          dataReceived: !!data,
          rowCount: data?.length || 0
        }
      })
    }

    // 设置测试摘要
    const failedTests = results.tests.filter((t: any) => t.status === 'failed')
    
    if (failedTests.length === 0) {
      results.summary = {
        status: 'success',
        message: '所有测试通过，Supabase连接正常'
      }
    } else {
      results.summary = {
        status: 'failed',
        message: `${failedTests.length}/${results.tests.length} 个测试失败`,
        firstError: failedTests[0]?.error?.message || '未知错误'
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('数据库测试API发生错误:', error)
    
    return NextResponse.json({
      ...results,
      summary: {
        status: 'error',
        message: '测试过程中发生错误',
        error: error.message
      }
    }, { status: 500 })
  }
}

// 工具函数：检查环境变量
function checkEnvironmentVariable(name: string, isSensitive = false) {
  const value = process.env[name]
  
  if (!value) {
    return { exists: false, status: 'missing' }
  }
  
  if (isSensitive) {
    // 对于敏感值，只返回长度和部分值的掩码
    return { 
      exists: true, 
      status: 'available',
      length: value.length,
      mask: value.length > 10 ? 
        `${value.substring(0, 3)}...${value.substring(value.length - 3)}` : 
        '***'
    }
  }
  
  return { 
    exists: true, 
    status: 'available',
    value: value 
  }
}

// 工具函数：掩盖敏感字符串
function maskString(str: string) {
  if (!str) return ''
  if (str.length <= 8) return '****'
  return str.substring(0, 4) + '****' + str.substring(str.length - 4)
}

// 工具函数：运行单个测试并记录结果
async function runTest(results: any, name: string, testFn: () => Promise<any>) {
  // 定义测试结果类型，包含可选的属性
  const testResult: {
    name: string;
    status: string;
    startTime: number;
    duration?: number;
    data?: any;
    error?: {
      message: string;
      stack?: string;
    };
  } = {
    name,
    status: 'pending',
    startTime: Date.now()
  }
  
  results.tests.push(testResult)
  
  try {
    const data = await testFn()
    testResult.status = 'success'
    testResult.data = data
  } catch (error: any) {
    testResult.status = 'failed'
    testResult.error = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
    console.error(`测试失败 [${name}]:`, error)
  } finally {
    testResult.duration = Date.now() - testResult.startTime
  }
} 
