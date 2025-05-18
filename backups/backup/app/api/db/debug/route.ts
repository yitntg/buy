import { NextResponse } from 'next/server'
import pg from 'pg'

// 数据库调试API
export async function GET() {
  try {
    console.log('开始数据库调试...')
    
    // 收集环境信息
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV || 'unknown',
      POSTGRES_URL_EXISTS: !!process.env.POSTGRES_URL,
      POSTGRES_URL_NON_POOLING_EXISTS: !!process.env.POSTGRES_URL_NON_POOLING,
      NEXT_PUBLIC_SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
    
    // 选择连接URL
    const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!connectionString) {
      throw new Error('未找到数据库连接URL环境变量')
    }

    // 创建PostgreSQL客户端
    const client = new pg.Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // 允许自签名证书
      }
    })
    
    // 连接到数据库
    console.log('尝试连接数据库...')
    await client.connect()
    console.log('数据库连接成功')
    
    // 收集数据库信息
    const dbInfo: Record<string, any> = {}
    const tables = ['categories', 'products', 'reviews']
    
    // 检查表是否存在
    for (const table of tables) {
      try {
        const tableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table])
        
        dbInfo[`${table}_exists`] = tableCheck.rows[0].exists
        
        if (tableCheck.rows[0].exists) {
          // 获取表中的记录数
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`)
          dbInfo[`${table}_count`] = countResult.rows[0].count
          
          // 获取表结构
          const schemaResult = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = $1
          `, [table])
          dbInfo[`${table}_schema`] = schemaResult.rows
        }
      } catch (err) {
        dbInfo[`${table}_error`] = err instanceof Error ? err.message : '未知错误'
      }
    }
    
    // 检查外键约束
    try {
      const fkResult = await client.query(`
        SELECT
          tc.table_schema, 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
      `)
      
      dbInfo.foreign_keys = fkResult.rows
    } catch (err) {
      dbInfo.foreign_keys_error = err instanceof Error ? err.message : '未知错误'
    }
    
    // 关闭数据库连接
    await client.end()
    
    // 返回调试信息
    return new NextResponse(`
      <html>
        <head>
          <title>数据库调试</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 1000px; margin: 0 auto; }
            pre { background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; overflow: auto; max-height: 400px; }
            .section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 0.5rem; }
            h2 { margin-top: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; }
            .back { margin-top: 1rem; display: inline-block; }
            .actions { display: flex; gap: 1rem; margin-top: 1rem; }
            .btn { display: inline-block; padding: 0.5rem 1rem; background: #3182ce; color: white; text-decoration: none; border-radius: 0.25rem; }
          </style>
        </head>
        <body>
          <h1>数据库调试信息</h1>
          
          <div class="section">
            <h2>环境变量</h2>
            <pre>${JSON.stringify(envInfo, null, 2)}</pre>
          </div>
          
          <div class="section">
            <h2>数据库表信息</h2>
            
            ${tables.map(table => `
              <h3>表: ${table}</h3>
              ${dbInfo[`${table}_exists`] 
                ? `
                  <p>记录数: ${dbInfo[`${table}_count`]}</p>
                  <h4>表结构:</h4>
                  <table>
                    <tr>
                      <th>列名</th>
                      <th>数据类型</th>
                      <th>可为空</th>
                    </tr>
                    ${dbInfo[`${table}_schema`].map((col: any) => `
                      <tr>
                        <td>${col.column_name}</td>
                        <td>${col.data_type}</td>
                        <td>${col.is_nullable}</td>
                      </tr>
                    `).join('')}
                  </table>
                `
                : `
                  <p>表不存在或无法访问</p>
                  ${dbInfo[`${table}_error`] ? `<p>错误: ${dbInfo[`${table}_error`]}</p>` : ''}
                `
              }
            `).join('')}
          </div>
          
          <div class="section">
            <h2>外键约束</h2>
            ${dbInfo.foreign_keys && dbInfo.foreign_keys.length > 0
              ? `
                <table>
                  <tr>
                    <th>约束名</th>
                    <th>表名</th>
                    <th>列名</th>
                    <th>引用表</th>
                    <th>引用列</th>
                  </tr>
                  ${dbInfo.foreign_keys.map((fk: any) => `
                    <tr>
                      <td>${fk.constraint_name}</td>
                      <td>${fk.table_name}</td>
                      <td>${fk.column_name}</td>
                      <td>${fk.foreign_table_name}</td>
                      <td>${fk.foreign_column_name}</td>
                    </tr>
                  `).join('')}
                </table>
              `
              : `<p>未发现外键约束或查询出错</p>`
            }
            ${dbInfo.foreign_keys_error ? `<p>错误: ${dbInfo.foreign_keys_error}</p>` : ''}
          </div>
          
          <div class="actions">
            <a href="/setup" class="btn">返回设置页面</a>
            <a href="/api/db/add-sample-data" class="btn">添加示例数据</a>
            <a href="/api/db/add-sample-data?check=true" class="btn">检查数据</a>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (error: any) {
    console.error('调试过程中发生错误:', error)
    
    // 返回错误页面
    return new NextResponse(`
      <html>
        <head>
          <title>数据库调试</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .error { color: #e53e3e; }
            .back { margin-top: 1rem; display: inline-block; }
            pre { background: #f7f7f7; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
          </style>
        </head>
        <body>
          <h1 class="error">调试失败</h1>
          <p>执行数据库调试时发生错误：</p>
          <pre>${error instanceof Error ? error.message : '未知错误'}</pre>
          
          <p><a href="/setup" class="back">返回设置页面</a></p>
        </body>
      </html>
    `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
} 