import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 确保有可用的密钥
if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error('缺少Supabase URL或密钥')
}

export async function POST(request: NextRequest) {
  try {
    console.log('开始创建drop_table函数流程')
    
    // 创建管理员客户端
    const adminKey = supabaseServiceKey || supabaseAnonKey
    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION drop_table(table_name text, cascade boolean DEFAULT false)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      IF cascade THEN
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(table_name) || ' CASCADE';
      ELSE
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(table_name);
      END IF;
    END;
    $$;

    -- 授予执行权限，只授予给已认证用户
    GRANT EXECUTE ON FUNCTION drop_table TO authenticated;
    `
    
    // 方法1：检查函数是否已存在
    try {
      console.log('检查drop_table函数是否已存在')
      
      // 先检查exec_sql函数是否存在
      try {
        const checkExecSQL = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': adminKey,
            'Authorization': `Bearer ${adminKey}`
          },
          body: JSON.stringify({
            sql: 'SELECT 1'  // 简单测试
          })
        })
        
        if (!checkExecSQL.ok) {
          // 尝试备用方法 - 直接使用supabase客户端
          try {
            const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createFunctionSQL })
            
            if (!error) {
              return NextResponse.json({
                success: true,
                message: 'drop_table函数已成功创建'
              })
            }
            
            throw new Error('exec_sql调用失败')
          } catch {
            return NextResponse.json({ 
              error: 'exec_sql函数不存在或有错误，请先创建该函数' 
            }, { status: 400 })
          }
        }
        
        // 检查响应是否为JSON
        let checkResult
        try {
          const responseClone = checkExecSQL.clone()
          const responseText = await responseClone.text()
          
          if (responseText.trim()) {
            try {
              checkResult = JSON.parse(responseText)
            } catch {
              checkResult = { text: responseText }
            }
          }
        } catch (parseError) {
          console.log('解析响应失败，但继续执行:', parseError)
        }
        
        console.log('exec_sql函数存在，继续创建drop_table函数')
      } catch (checkError) {
        console.error('检查exec_sql函数失败:', checkError)
        return NextResponse.json({ 
          error: `检查exec_sql函数失败: ${checkError instanceof Error ? checkError.message : '未知错误'}` 
        }, { status: 500 })
      }
      
      // 使用exec_sql创建drop_table函数
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createFunctionSQL })
      
      if (error) {
        // 如果函数已存在，视为成功
        if (error.message.includes('already exists')) {
          return NextResponse.json({
            success: true,
            message: 'drop_table函数已存在'
          })
        }
        
        throw new Error(`通过exec_sql创建失败: ${error.message}`)
      }
      
      return NextResponse.json({
        success: true,
        message: 'drop_table函数已成功创建'
      })
    } catch (error: any) {
      console.error('创建drop_table函数失败:', error)
      return NextResponse.json({ 
        error: `创建drop_table函数失败: ${error.message}` 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('创建drop_table函数过程中发生错误:', error)
    return NextResponse.json({ 
      error: `创建drop_table函数失败: ${error.message}` 
    }, { status: 500 })
  }
} 