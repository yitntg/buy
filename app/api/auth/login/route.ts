import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let credentials
    
    try {
      credentials = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { email, password } = credentials
    
    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必填字段' },
        { status: 400 }
      )
    }
    
    console.log(`尝试用户登录: ${email}`)
    
    // 查询用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !user) {
      console.log(`登录失败: 用户 ${email} 不存在`)
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }
    
    // 为了简化演示，我们暂时不做真正的密码验证
    // 在真实项目中，应该使用加密算法比较密码，例如 bcrypt.compare
    
    // 测试模式 - 默认允许登录
    console.log(`用户 ${email} 登录成功`)
    
    // 更新最后登录时间
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        status: 'active'
      })
      .eq('id', user.id)
    
    // 移除敏感信息
    if (user.password_hash) {
      delete user.password_hash
    }
    
    return NextResponse.json({
      user,
      message: '登录成功'
    })
  } catch (error: any) {
    console.error('登录处理错误:', error)
    return NextResponse.json({ 
      error: '登录失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 