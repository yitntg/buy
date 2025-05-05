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
    console.log('开始创建query_sql函数流程')
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
    CREATE OR REPLACE FUNCTION query_sql(sql text)
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result JSONB;
    BEGIN
      -- 尝试将结果转换为JSON数组，便于前端处理
      EXECUTE 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (' || sql || ') t' INTO result;
      -- 如果结果为null（空查询结果），返回空数组
      RETURN COALESCE(result, '[]'::jsonb);
    EXCEPTION WHEN OTHERS THEN
      -- 记录错误并重新抛出
      RAISE EXCEPTION '执行查询失败: %', SQLERRM;
    END;
    $$;

    -- 授予执行权限
    GRANT EXECUTE ON FUNCTION query_sql TO authenticated;
    GRANT EXECUTE ON FUNCTION query_sql TO anon;
    `
    
    // 尝试多种方法创建query_sql函数
    
    // 方法1：直接使用REST API
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': adminKey,
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          sql: 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (SELECT 1 as test) t'  // 简单测试函数是否已存在
        })
      })
      
      if (response.ok) {
        // 函数已存在
        return NextResponse.json({
          success: true,
          message: 'query_sql函数已存在'
        })
      }
    } catch (error) {
      // 继续尝试其他方法
      console.log('query_sql函数不存在，尝试创建...')
    }
    
    // 方法2：使用exec_sql函数创建
    try {
      console.log('尝试方法2: 使用exec_sql函数创建query_sql')
      
      // 先检查exec_sql函数是否存在
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
      
      if (checkExecSQL.ok) {
        // 使用exec_sql创建query_sql函数
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createFunctionSQL })
        
        if (error) {
          throw new Error(`通过exec_sql创建失败: ${error.message}`)
        }
        
        return NextResponse.json({
          success: true,
          message: 'query_sql函数已成功创建'
        })
      }
    } catch (error: any) {
      console.log('使用exec_sql创建失败:', error.message)
      // 继续尝试其他方法
    }
    
    // 方法3：使用PostgreSQL API创建函数
    try {
      console.log('尝试方法3: 使用PostgreSQL API创建函数')
      
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
                  message: 'query_sql函数已成功创建'
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
      
      // 如果所有尝试都失败，返回最后一个错误
      if (lastError) {
        throw new Error(`所有API尝试均失败。最后错误: ${lastError.status}, ${lastError.body}`);
      }
    } catch (error: any) {
      console.error('创建query_sql函数失败:', error);
      return NextResponse.json({ 
        error: `创建query_sql函数失败: ${error.message}` 
      }, { status: 500 });
    }
    
    // 如果执行到这里，说明所有方法都失败了
    return NextResponse.json({ 
      error: '无法创建query_sql函数，请检查服务器日志。' 
    }, { status: 500 });
  } catch (error: any) {
    console.error('创建query_sql函数过程中发生错误:', error);
    return NextResponse.json({ 
      error: `创建query_sql函数失败: ${error.message}` 
    }, { status: 500 });
  }
} 