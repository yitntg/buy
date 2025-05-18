import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import * as OTPAuth from 'otpauth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let mfaData
    
    try {
      mfaData = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { code, type, userId } = mfaData
    
    // 验证必填字段
    if (!code) {
      return NextResponse.json(
        { error: '验证码是必填字段' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必填字段' },
        { status: 400 }
      )
    }
    
    if (!type) {
      return NextResponse.json(
        { error: 'MFA类型是必填字段' },
        { status: 400 }
      )
    }
    
    // 创建服务端Supabase客户端
    const supabase = createClient()
    
    // 获取当前会话，确保用户处于登录状态
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
    
    // 获取用户的MFA因子
    const { data: userMfaFactor, error: mfaError } = await supabase
      .from('user_mfa_factors')
      .select('secret, verified')
      .eq('user_id', userId)
      .eq('type', type)
      .single()
    
    if (mfaError || !userMfaFactor) {
      return NextResponse.json(
        { error: '未找到MFA配置' },
        { status: 404 }
      )
    }
    
    if (!userMfaFactor.secret) {
      return NextResponse.json(
        { error: 'MFA配置无效' },
        { status: 400 }
      )
    }
    
    let isValid = false
    
    // 验证MFA代码
    if (type === 'app') {
      // 使用otpauth库验证TOTP代码
      try {
        const totp = new OTPAuth.TOTP({
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromBase32(userMfaFactor.secret)
        })
        
        // 验证代码
        const delta = totp.validate({ token: code, window: 1 })
        isValid = delta !== null
      } catch (error) {
        console.error('验证TOTP代码时发生错误:', error)
        return NextResponse.json(
          { error: '验证过程中发生错误' },
          { status: 500 }
        )
      }
    } else if (type === 'sms' || type === 'email') {
      // 对于SMS和Email验证码，与数据库中的记录比较
      try {
        // 使用RPC函数检查验证码
        const { data: isValidCode, error: validationError } = await supabase.rpc('verify_code', {
          p_user_id: userId,
          p_type: type,
          p_code: code
        })
        
        if (validationError) {
          console.error('验证码验证失败:', validationError)
          return NextResponse.json(
            { error: '验证码无效或已过期' },
            { status: 400 }
          )
        }
        
        isValid = !!isValidCode
      } catch (error) {
        console.error('验证一次性验证码时发生错误:', error)
        return NextResponse.json(
          { error: '验证过程中发生错误' },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: '不支持的MFA类型' },
        { status: 400 }
      )
    }
    
    if (!isValid) {
      return NextResponse.json(
        { error: '验证码无效' },
        { status: 400 }
      )
    }
    
    // 如果是首次验证，更新verified状态
    if (!userMfaFactor.verified) {
      await supabase
        .from('user_mfa_factors')
        .update({ 
          verified: true,
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('type', type)
      
      // 更新用户MFA状态
      await supabase
        .from('users')
        .update({ 
          mfa_verified: true,
          mfa_enabled: true,
          mfa_status: 'enabled'
        })
        .eq('id', userId)
    } else {
      // 更新最后使用时间
      await supabase
        .from('user_mfa_factors')
        .update({ last_used_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('type', type)
    }
    
    // 设置MFA验证成功的cookie或会话标记
    cookies().set({
      name: 'mfa_verified',
      value: 'true',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24小时
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    })
    
    return NextResponse.json({
      success: true,
      message: 'MFA验证成功'
    })
    
  } catch (error: any) {
    console.error('MFA验证处理错误:', error)
    return NextResponse.json({ 
      error: 'MFA验证失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 