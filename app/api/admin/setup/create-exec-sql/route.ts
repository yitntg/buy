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
    console.log('开始创建exec_sql函数流程')
    console.log('使用的Supabase URL:', supabaseUrl)
    console.log('是否有服务密钥:', !!supabaseServiceKey)
    console.log('是否有匿名密钥:', !!supabaseAnonKey)
    
    // 创建管理员客户端
    const adminKey = supabaseServiceKey || supabaseAnonKey
    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
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
    
    // 尝试多种方法创建exec_sql函数
    
    // 方法1：直接使用REST API
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': adminKey,
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          sql: 'SELECT 1'  // 简单测试函数是否已存在
        })
      })
      
      if (response.ok) {
        // 函数已存在
        return NextResponse.json({
          success: true,
          message: 'exec_sql函数已存在'
        })
      }
    } catch (error) {
      // 继续尝试其他方法
      console.log('exec_sql函数不存在，尝试创建...')
    }
    
    // 方法2：使用PostgreSQL API创建函数
    try {
      console.log('尝试方法2: 使用PostgreSQL API创建函数')
      
      // 尝试使用多种可能的SQL执行API端点
      const endpoints = [
        '/rest/v1/sql',
        '/rest/v1/query',
        '/rest/v1/',
        '/rest/v1',
        '/rest/v1/pg', // 新增可能的端点
        '/sql', // 尝试不同路径
        '/' // 直接访问根路径
      ];
      
      // 尝试不同的请求格式
      const payloadFormats = [
        // 标准SQL对象格式
        (sql: string) => ({ query: sql }),
        // 简单字符串格式
        (sql: string) => ({ sql: sql }),
        // 命令格式
        (sql: string) => ({ command: sql }),
        // 包含多个字段的格式
        (sql: string) => ({ query: sql, sql: sql, command: sql }),
        // 纯SQL字符串格式
        (sql: string) => sql
      ];
      
      let lastError = null;
      let success = false;
      
      // 尝试不同的内容类型
      const contentTypes = [
        'application/json',
        'text/plain',
        'application/sql'
      ];
      
      for (const endpoint of endpoints) {
        if (success) break;
        
        for (const formatFn of payloadFormats) {
          if (success) break;
          
          for (const contentType of contentTypes) {
            try {
              console.log(`尝试使用endpoint: ${endpoint}, contentType: ${contentType}`);
              
              const payload = formatFn(createFunctionSQL);
              const body = contentType === 'application/json' ? 
                JSON.stringify(payload) : 
                typeof payload === 'string' ? payload : JSON.stringify(payload);
              
              const pgResponse = await fetch(`${supabaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': contentType,
                  'apikey': adminKey,
                  'Authorization': `Bearer ${adminKey}`,
                  'Prefer': 'resolution=ignore-duplicates'
                },
                body: body
              });
              
              if (pgResponse.ok) {
                console.log(`PostgreSQL API请求成功 使用endpoint: ${endpoint}, contentType: ${contentType}`);
                success = true;
                return NextResponse.json({
                  success: true,
                  message: 'exec_sql函数已成功创建'
                });
              } else {
                const errorBody = await pgResponse.text();
                console.log(`尝试endpoint ${endpoint} 失败:`, pgResponse.status, errorBody.substring(0, 100));
                lastError = { status: pgResponse.status, body: errorBody, endpoint, contentType };
              }
            } catch (endpointError) {
              console.log(`尝试endpoint ${endpoint}, contentType: ${contentType} 出错:`, endpointError);
            }
          }
        }
      }
      
      // 所有端点都尝试失败
      if (lastError) {
        console.error('所有PostgreSQL API端点都失败，最后错误状态:', lastError.status);
        console.error('错误详情:', lastError.body);
        throw new Error(`无法创建exec_sql函数: 状态码 ${lastError.status}`);
      } else {
        throw new Error('所有PostgreSQL API端点都失败，未能获取错误详情');
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: `创建exec_sql函数失败: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('创建exec_sql函数出错:', error)
    return NextResponse.json(
      { error: `创建exec_sql函数失败: ${error.message}` },
      { status: 500 }
    )
  }
} 