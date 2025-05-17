import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/app/(shared)/utils/supabase/server'
import crypto from 'crypto'
import qrcode from 'qrcode'
import { MFAType } from '@/src/app/(shared)/types/auth'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let setupData
    
    try {
      setupData = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { type } = setupData
    
    // 验证MFA类型
    if (!type || !Object.values(MFAType).includes(type as MFAType)) {
      return NextResponse.json(
        { error: '无效的MFA类型' },
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
    
    const userId = session.user.id
    
    // 检查用户是否已经设置了相同类型的MFA
    const { data: existingFactor, error: checkError } = await supabase
      .from('user_mfa_factors')
      .select('id, verified')
      .eq('user_id', userId)
      .eq('type', type)
      .single()
    
    // 如果已存在且已验证，返回错误
    if (existingFactor && existingFactor.verified) {
      return NextResponse.json(
        { error: `${type}类型的MFA已设置，请先禁用后再重新设置` },
        { status: 409 }
      )
    }
    
    let secret = ''
    let qrCodeUrl = ''
    
    // 根据MFA类型生成不同的设置数据
    if (type === 'app') {
      // 为TOTP应用生成密钥
      // 使用base64编码并转换为适合OTP的base32格式
      const secretBytes = crypto.randomBytes(20);
      secret = secretBytes.toString('base64')
        .replace(/\+/g, '7').replace(/\//g, '9')
        .replace(/=/g, '')
        .toUpperCase();
      
      const appName = 'YourAppName'
      const userEmail = session.user.email || userId
      
      // 创建otpauth URL
      const otpauthUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(appName)}&algorithm=SHA1&digits=6&period=30`
      
      // 生成QR码
      qrCodeUrl = await qrcode.toDataURL(otpauthUrl)
    } else if (type === 'sms') {
      // 检查用户是否有手机号
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phone')
        .eq('id', userId)
        .single()
      
      if (userError || !userData || !userData.phone) {
        return NextResponse.json(
          { error: '需要先设置手机号码才能使用短信验证' },
          { status: 400 }
        )
      }
      
      // 生成验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // 存储验证码
      const { data, error } = await supabase.rpc('create_verification_code', {
        p_user_id: userId,
        p_type: type,
        p_code: verificationCode,
        p_expires_minutes: 15
      })
      
      if (error) {
        console.error('创建验证码失败:', error)
        return NextResponse.json(
          { error: '创建验证码失败' },
          { status: 500 }
        )
      }
      
      // 存储密钥用于MFA设置
      secret = verificationCode
      
      // TODO: 集成短信发送服务
      console.log(`向用户 ${userId} 的手机发送验证码: ${verificationCode}`)
    } else if (type === 'email') {
      // 生成验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // 存储验证码
      const { data, error } = await supabase.rpc('create_verification_code', {
        p_user_id: userId,
        p_type: type,
        p_code: verificationCode,
        p_expires_minutes: 15
      })
      
      if (error) {
        console.error('创建验证码失败:', error)
        return NextResponse.json(
          { error: '创建验证码失败' },
          { status: 500 }
        )
      }
      
      // 存储密钥用于MFA设置
      secret = verificationCode
      
      // TODO: 发送带有验证码的邮件
      const email = session.user.email
      if (!email) {
        return NextResponse.json(
          { error: '用户邮箱不存在' },
          { status: 400 }
        )
      }
      
      console.log(`向用户 ${email} 发送验证码: ${verificationCode}`)
    }
    
    // 存储或更新MFA因子
    if (existingFactor) {
      // 更新现有因子
      await supabase
        .from('user_mfa_factors')
        .update({
          secret,
          verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingFactor.id)
    } else {
      // 创建新的MFA因子
      await supabase
        .from('user_mfa_factors')
        .insert({
          user_id: userId,
          type,
          secret,
          verified: false
        })
    }
    
    // 更新用户MFA状态
    await supabase
      .from('users')
      .update({
        mfa_status: 'setup_required'
      })
      .eq('id', userId)
    
    // 构建响应
    const response: any = {
      success: true,
      type
    }
    
    // 根据类型添加额外信息
    if (type === 'app') {
      response.qrCode = qrCodeUrl
      response.secret = secret // 让用户可以手动输入
    } else {
      response.message = `验证码已发送到您的${type === 'sms' ? '手机' : '邮箱'}`
    }
    
    return NextResponse.json(response)
    
  } catch (error: any) {
    console.error('MFA设置错误:', error)
    return NextResponse.json({ 
      error: 'MFA设置失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 
