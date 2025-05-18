import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

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
    
    const { email, password, rememberMe } = credentials
    
    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必填字段' },
        { status: 400 }
      )
    }
    
    // 创建服务端Supabase客户端
    const supabase = createClient()
    
    // 登录用户
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('登录失败:', error.message)
      
      let statusCode = 400
      let errorMessage = '登录失败'
      
      // 处理常见错误
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = '邮箱或密码错误'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '邮箱未验证，请先验证您的邮箱'
        statusCode = 403
      } else if (error.message.includes('Too many requests')) {
        errorMessage = '登录尝试次数过多，请稍后再试'
        statusCode = 429
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      )
    }
    
    // 检查用户是否启用了MFA
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('mfa_enabled, mfa_status')
      .eq('id', data.user.id)
      .single()
    
    // 构建响应
    const response: any = {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'user'
      }
    }
    
    // 如果用户启用了MFA，则返回需要MFA验证的状态
    if (userData?.mfa_enabled) {
      response.requiresMFA = true
      response.mfaStatus = userData.mfa_status
      
      return NextResponse.json(response, { status: 200 })
    }
    
    // 设置会话cookie(其实由supabase客户端自动处理)
    
    // 如果设置了记住我，延长cookie过期时间
    if (rememberMe) {
      // 获取当前的cookie
      const supabaseCookie = cookies().get('sb-access-token')
      if (supabaseCookie) {
        // 设置较长的过期时间（30天）
        cookies().set({
          name: 'sb-access-token',
          value: supabaseCookie.value,
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: 'lax'
        })
      }
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error: any) {
    console.error('登录处理错误:', error)
    return NextResponse.json({ 
      error: '登录失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 