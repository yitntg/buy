import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
    `
    
    // 使用supabase-js的rpc调用直接执行SQL语句
    // 注意：这需要管理员权限
    const { error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL })
    
    // 如果exec_sql函数不存在，则会产生错误
    if (error && error.message.includes('does not exist')) {
      // 尝试使用REST API直接执行SQL
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
          },
          body: JSON.stringify({
            query: createFunctionSQL
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Supabase REST API错误: ${JSON.stringify(errorData)}`)
        }
        
        return NextResponse.json({
          success: true,
          message: 'exec_sql函数已成功创建'
        })
      } catch (restError: any) {
        console.error('使用REST API创建函数失败:', restError)
        return NextResponse.json(
          { error: `创建exec_sql函数失败: ${restError.message}` },
          { status: 500 }
        )
      }
    } else if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'exec_sql函数已存在或已成功创建'
    })
  } catch (error: any) {
    console.error('创建exec_sql函数失败:', error)
    return NextResponse.json(
      { error: `创建exec_sql函数失败: ${error.message}` },
      { status: 500 }
    )
  }
} 