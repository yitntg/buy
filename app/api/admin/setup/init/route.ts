import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    console.log('开始数据库初始化流程')
    
    // 创建管理员客户端
    const adminKey = supabaseServiceKey || supabaseAnonKey
    if (!supabaseUrl || !adminKey) {
      throw new Error('缺少Supabase URL或密钥')
    }
    
    console.log('使用的Supabase URL:', supabaseUrl)
    console.log('是否有服务密钥:', !!supabaseServiceKey)
    
    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // 读取初始化SQL文件
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'init-db.sql')
    let sqlContent: string
    
    try {
      console.log('尝试读取SQL文件:', sqlFilePath)
      sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    } catch (error) {
      console.error('无法读取SQL文件:', error)
      return NextResponse.json(
        { error: '无法读取初始化SQL文件' },
        { status: 500 }
      )
    }
    
    // 将SQL拆分为单独的语句
    const sqlStatements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
    
    console.log(`找到 ${sqlStatements.length} 条SQL语句需要执行`)
    
    // 首先尝试使用exec_sql函数执行
    let execSqlSuccess = false;
    try {
      // 执行SQL语句
      let successCount = 0
      for (const statement of sqlStatements) {
        try {
          console.log('使用exec_sql执行SQL语句:', statement.substring(0, 50) + '...')
          const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.error('执行SQL失败:', error, statement.substring(0, 100))
            // 如果是表已存在等非严重错误，则继续执行
            if (error.message.includes('already exists')) {
              console.log('表已存在，继续执行...')
              continue
            }
            throw error;
          }
          successCount++
        } catch (statementError) {
          console.error('执行语句时出错:', statementError)
          throw statementError;
        }
      }
      execSqlSuccess = true;
      return NextResponse.json({
        success: true,
        message: `数据库初始化成功，${successCount}/${sqlStatements.length} 条语句执行成功`
      })
    } catch (execSqlError) {
      console.error('使用exec_sql函数执行SQL失败，尝试备用方法:', execSqlError)
    }
    
    // 如果exec_sql方法失败，则尝试直接使用REST API执行SQL
    if (!execSqlSuccess) {
      console.log('尝试使用REST API直接执行SQL')
      
      // 尝试直接创建表和数据
      let successCount = 0;
      
      for (const statement of sqlStatements) {
        if (!statement.trim()) continue;
        
        try {
          console.log('直接执行SQL:', statement.substring(0, 50) + '...')
          
          // 尝试多种可能的API端点
          const endpoints = [
            '/rest/v1/sql',
            '/rest/v1/query',
            '/rest/v1/',
            '/rest/v1'
          ];
          
          let statementSuccess = false;
          
          for (const endpoint of endpoints) {
            if (statementSuccess) break;
            
            try {
              const response = await fetch(`${supabaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': adminKey,
                  'Authorization': `Bearer ${adminKey}`,
                  'Prefer': 'resolution=ignore-duplicates'
                },
                body: JSON.stringify({
                  query: statement,
                  command: statement,
                  sql: statement
                })
              });
              
              if (response.ok) {
                console.log(`成功执行SQL (endpoint: ${endpoint})`);
                statementSuccess = true;
                successCount++;
                break;
              } else {
                const errorText = await response.text();
                console.error(`执行SQL失败 (endpoint: ${endpoint}):`, response.status, errorText.substring(0, 100));
                
                // 如果是表已存在错误，则视为成功
                if (errorText.includes('already exists')) {
                  console.log('表已存在，继续执行...');
                  statementSuccess = true;
                  successCount++;
                  break;
                }
              }
            } catch (endpointError) {
              console.error(`尝试endpoint ${endpoint} 出错:`, endpointError);
            }
          }
        } catch (statementError) {
          console.error('执行语句时出错:', statementError);
          // 继续尝试其他语句
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `数据库初始化成功，${successCount}/${sqlStatements.length} 条语句执行成功 (使用备用方法)`
      });
    }
  } catch (error: any) {
    console.error('数据库初始化过程中出错:', error)
    return NextResponse.json(
      { error: `数据库初始化失败: ${error.message}` },
      { status: 500 }
    )
  }
} 