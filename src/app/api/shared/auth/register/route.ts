import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/app/(shared)/utils/supabase/server'

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
    
    const { email, password, firstName, lastName, username } = userData
    
    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必填字段' },
        { status: 400 }
      )
    }
    
    // 密码强度验证
    if (password.length < 8) {
      return NextResponse.json(
        { error: '密码长度必须至少为8个字符' },
        { status: 400 }
      )
    }
    
    // 创建服务端Supabase客户端
    const supabase = createClient()
    
    // 注册用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'user',
          username,
          firstName,
          lastName
        }
      }
    })
    
    if (error) {
      console.error('注册失败:', error.message)
      
      let statusCode = 400
      let errorMessage = '注册失败'
      
      // 处理常见错误
      if (error.message.includes('already registered')) {
        errorMessage = '该邮箱已被注册'
        statusCode = 409
      } else if (error.message.includes('weak password')) {
        errorMessage = '密码强度不足，请设置更复杂的密码'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = '注册请求过于频繁，请稍后再试'
        statusCode = 429
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      )
    }
    
    // 创建用户配置文件
    // 注意：此处使用auth.users.id，因为新用户已在auth.users表中创建
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user?.id,
        email: email,
        username: username || null,
        first_name: firstName || null,
        last_name: lastName || null,
        avatar: null,
        role: 'user',
        mfa_enabled: false,
        mfa_status: 'disabled'
      })
    
    if (profileError) {
      console.error('创建用户配置文件失败:', profileError)
      
      // 尝试清理已创建的认证用户
      try {
        // 这里需要管理员访问权限，实际项目中应由管理员API处理
        await supabase.auth.admin.deleteUser(data.user?.id!)
      } catch (deleteError) {
        console.error('清理失败的用户注册时出错:', deleteError)
      }
      
      return NextResponse.json({ 
        error: '创建用户配置文件失败', 
        details: profileError.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      message: '注册成功，请检查您的邮箱进行验证',
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('注册处理错误:', error)
    return NextResponse.json({ 
      error: '注册失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 
