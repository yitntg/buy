import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取Supabase凭据
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 确保有可用的密钥
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少Supabase URL或密钥')
}

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json()
    const { table, sql } = body
    
    // 验证参数
    if (!table || !sql) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }
    
    // 使用服务角色密钥创建Supabase客户端
    // 注意：这需要SUPABASE_SERVICE_ROLE_KEY环境变量，它有更高的权限
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // 执行SQL语句
    const { error } = await supabaseAdmin.rpc('execute_sql', { sql })
    
    if (error) {
      console.error(`执行SQL失败:`, error)
      
      // 尝试另一种方法：直接运行SQL（如果支持）
      const { error: sqlError } = await supabaseAdmin.from('_exec_sql').select('*').eq('query', sql).single()
      
      if (sqlError) {
        return NextResponse.json(
          { error: `创建表失败: ${error.message}` },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ success: true, message: `${table}表创建成功` })
  } catch (error) {
    console.error('处理请求时出错:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 