import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // 删除表中的所有数据
    const tables = ['reviews', 'products', 'categories']
    
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', 0)
      
      if (error && error.code !== '42P01') { // 忽略表不存在错误
        console.error(`清空表 ${table} 失败:`, error)
        return NextResponse.json(
          { error: `重置数据库失败: 无法清空 ${table} 表` },
          { status: 500 }
        )
      }
    }
    
    // 重新创建表结构和示例数据
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'init-db.sql')
    let sqlContent: string
    
    try {
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
    
    // 执行SQL语句
    for (const statement of sqlStatements) {
      // 如果是创建表的语句，先尝试删除表
      if (statement.toUpperCase().includes('CREATE TABLE')) {
        const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1]
        
        if (tableName) {
          await supabase.rpc('exec_sql', { 
            sql: `DROP TABLE IF EXISTS ${tableName} CASCADE` 
          })
        }
      }
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error('执行SQL失败:', error, statement)
        return NextResponse.json(
          { error: `数据库重置失败: ${error.message}` },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '数据库已成功重置'
    })
  } catch (error: any) {
    console.error('数据库重置失败:', error)
    return NextResponse.json(
      { error: `数据库重置失败: ${error.message}` },
      { status: 500 }
    )
  }
} 