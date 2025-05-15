import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/utils/supabase/server'
import { MFAType } from '@/shared/types/auth'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let data
    
    try {
      data = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { type, userId } = data
    
    // 验证必填字段
    if (!type || !Object.values(MFAType).includes(type as MFAType)) {
      return NextResponse.json(
        { error: '无效的MFA类型' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必填字段' },
        { status: 400 }
      )
    }
    
    // 创建服务端Supabase客户端
    const supabase = createClient()
    
    // 获取当前会话，确保用户已登录
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      )
    }
    
    // 确保会话用户与请求的用户匹配
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: '未授权，用户ID不匹配' },
        { status: 403 }
      )
    }
    
    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 调用SQL函数创建验证码，该函数已在数据库中定义
    const { data: codeData, error: codeError } = await supabase.rpc(
      'create_verification_code',
      {
        p_user_id: userId,
        p_type: type,
        p_code: verificationCode,
        p_expires_minutes: 15
      }
    )
    
    if (codeError) {
      console.error('创建验证码失败:', codeError)
      return NextResponse.json(
        { error: '发送验证码失败' },
        { status: 500 }
      )
    }
    
    // 根据类型发送验证码
    if (type === 'sms') {
      // 获取用户手机号
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single()
      
      if (userError || !userData?.phone) {
        return NextResponse.json(
          { error: '未找到用户手机号' },
          { status: 400 }
        )
      }
      
      // TODO: 集成短信发送服务
      console.log(`向手机号 ${userData.phone} 发送验证码: ${verificationCode}`)
      
    } else if (type === 'email') {
      // 使用用户邮箱
      const email = session.user.email
      
      if (!email) {
        return NextResponse.json(
          { error: '未找到用户邮箱' },
          { status: 400 }
        )
      }
      
      // TODO: 集成邮件发送服务
      console.log(`向邮箱 ${email} 发送验证码: ${verificationCode}`)
    }
    
    return NextResponse.json({
      success: true,
      message: `验证码已发送到您的${type === 'sms' ? '手机' : '邮箱'}`
    })
    
  } catch (error: any) {
    console.error('发送验证码错误:', error)
    return NextResponse.json({ 
      error: '发送验证码失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 
