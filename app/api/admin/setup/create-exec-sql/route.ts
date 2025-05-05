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
    console.log('开始创建exec_sql函数...')
    
    // 创建管理员客户端
    const adminKey = supabaseServiceKey || supabaseAnonKey
    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // 方法1：尝试直接使用SQL客户端创建函数
    try {
      console.log('尝试方法1: 直接使用SQL客户端创建函数')
      
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'SQL执行错误: %', SQLERRM;
      END;
      $$;
      
      -- 授予执行权限
      GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
      GRANT EXECUTE ON FUNCTION exec_sql TO anon;
      `
      
      // 尝试直接执行SQL
      const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { sql: createFunctionSQL })
      
      // 如果函数不存在，尝试执行原生SQL
      if (sqlError && sqlError.message.includes('does not exist')) {
        console.log('exec_sql函数不存在，尝试直接执行SQL...')
        const { error: directError } = await supabaseAdmin.rpc('_dump_pg', { query: createFunctionSQL })
        
        if (directError) {
          console.log('直接执行SQL失败:', directError)
          // 继续尝试其他方法
        } else {
          console.log('成功直接执行SQL创建函数')
          return NextResponse.json({ success: true, message: '成功创建exec_sql函数' })
        }
      } else if (!sqlError) {
        console.log('成功使用exec_sql创建函数')
        return NextResponse.json({ success: true, message: '成功创建exec_sql函数' })
      }
    } catch (error) {
      console.log('方法1失败:', error)
      // 继续尝试其他方法
    }
    
    // 方法2：尝试使用REST API创建函数
    try {
      console.log('尝试方法2: 使用REST API创建函数')
      
      // 创建函数定义
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'SQL执行错误: %', SQLERRM;
      END;
      $$;
      
      -- 授予执行权限
      GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
      GRANT EXECUTE ON FUNCTION exec_sql TO anon;
      `
      
      // 尝试直接访问数据库
      const { data: pgVersionData, error: pgVersionError } = await supabaseAdmin
        .from('pg_version')
        .select('version')
        .limit(1)
      
      if (!pgVersionError) {
        console.log('检查数据库访问正常:', pgVersionData)
      }
      
      // 尝试使用多种可能的SQL执行API端点
      const endpoints = [
        '/rest/v1/rpc/exec_sql',
        '/rest/v1/sql',
        '/rest/v1/query',
        '/rest/v1/postgresql/query',
        '/rest/v1/',
        '/rest/v1',
        '/rest/v1/pg',
        '/sql',
        '/rpc/exec_sql',
        '/'
      ]
      
      // 尝试不同的请求格式
      const payloadFormats = [
        // 标准SQL对象格式
        (sql: string) => ({ query: sql }),
        // 简单字符串格式
        (sql: string) => ({ sql }),
        // 命令格式
        (sql: string) => ({ command: sql }),
        // exec_sql格式
        (sql: string) => ({ sql: createFunctionSQL }),
        // 包含多个字段的格式
        (sql: string) => ({ query: sql, sql, command: sql }),
        // 纯SQL字符串格式
        (sql: string) => sql
      ]
      
      // 尝试不同的内容类型
      const contentTypes = [
        'application/json',
        'text/plain',
        'application/x-www-form-urlencoded',
        'application/sql'
      ]
      
      let success = false
      let lastError = null
      
      // 遍历所有可能的组合
      for (const endpoint of endpoints) {
        for (const formatFn of payloadFormats) {
          for (const contentType of contentTypes) {
            try {
              console.log(`尝试: ${endpoint} - ${contentType}`)
              
              const payload = formatFn(createFunctionSQL)
              const body = contentType.includes('json') 
                ? JSON.stringify(payload)
                : contentType.includes('form-urlencoded')
                  ? new URLSearchParams(payload as any).toString()
                  : typeof payload === 'string' 
                    ? payload 
                    : JSON.stringify(payload)
              
              const url = new URL(endpoint, supabaseUrl).toString()
              console.log(`请求URL: ${url}`)
              
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': contentType,
                  'apikey': adminKey,
                  'Authorization': `Bearer ${adminKey}`,
                  'Prefer': 'resolution=merge-duplicates'
                },
                body
              })
              
              // 如果请求成功
              if (response.ok) {
                console.log(`成功执行 (endpoint: ${endpoint}, contentType: ${contentType})`)
                success = true
                
                return NextResponse.json({ 
                  success: true, 
                  message: '成功创建exec_sql函数',
                  method: `REST API (${endpoint})`
                })
              } else {
                const statusCode = response.status
                const responseClone = response.clone()
                let responseBody = ''
                
                try {
                  responseBody = await responseClone.text()
                } catch (textError) {
                  console.error('无法读取响应内容:', textError)
                }
                
                console.log(`请求失败 (endpoint: ${endpoint}):`, statusCode, responseBody.substring(0, 100))
                
                // 如果响应提示函数已存在，视为成功
                if (responseBody.includes('already exists')) {
                  console.log('函数已存在，无需重新创建')
                  return NextResponse.json({ success: true, message: 'exec_sql函数已存在' })
                }
                
                lastError = { status: statusCode, body: responseBody }
              }
            } catch (error) {
              console.error(`尝试 ${endpoint} 失败:`, error)
            }
          }
        }
      }
      
      // 如果所有尝试都失败，返回最后一个错误
      if (lastError) {
        throw new Error(`所有API尝试均失败。最后错误: ${lastError.status}, ${lastError.body}`)
      }
    } catch (error: any) {
      console.error('创建exec_sql函数失败:', error)
      return NextResponse.json({ error: `创建exec_sql函数失败: ${error.message}` }, { status: 500 })
    }
    
    // 如果执行到这里，说明所有方法都失败了
    return NextResponse.json({ error: '无法创建exec_sql函数，请检查服务器日志。' }, { status: 500 })
  } catch (error: any) {
    console.error('处理POST请求失败:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 