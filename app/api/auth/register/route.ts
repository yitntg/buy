import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let userData
    
    try {
      userData = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { username, email, password, avatar } = userData
    
    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: '用户名、邮箱和密码是必填字段' },
        { status: 400 }
      )
    }
    
    // 检查邮箱是否已经存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }
    
    console.log(`创建新用户: ${email}`)
    
    // 构建新用户数据
    // 在真实项目中，应该使用加密算法（如bcrypt）来存储密码
    const newUser = {
      username,
      email,
      password_hash: password, // 实际项目中应该加密
      role: 'user',
      status: 'active',
      avatar: avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${Date.now()}`,
      join_date: new Date().toISOString(),
      last_login: new Date().toISOString()
    }
    
    // 创建用户
    const { data: createdUser, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()
    
    if (error) {
      console.error('注册用户失败:', error)
      
      // 错误处理
      if (error.code === '23505') { // 唯一约束冲突
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 409 }
        )
      }
      
      return NextResponse.json({ 
        error: '注册失败', 
        details: error.message 
      }, { status: 500 })
    }
    
    // 移除敏感信息
    if (createdUser && createdUser.password_hash) {
      delete createdUser.password_hash
    }
    
    return NextResponse.json({
      user: createdUser,
      message: '注册成功'
    }, { status: 201 })
  } catch (error: any) {
    console.error('注册处理错误:', error)
    return NextResponse.json({ 
      error: '注册失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 