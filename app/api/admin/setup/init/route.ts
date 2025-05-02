import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // 读取初始化SQL文件
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
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error('执行SQL失败:', error, statement)
        // 如果是表已存在等非严重错误，则继续执行
        if (error.message.includes('already exists')) {
          continue
        }
        return NextResponse.json(
          { error: `数据库初始化失败: ${error.message}` },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '数据库初始化成功'
    })
  } catch (error: any) {
    console.error('数据库初始化失败:', error)
    return NextResponse.json(
      { error: `数据库初始化失败: ${error.message}` },
      { status: 500 }
    )
  }
} 