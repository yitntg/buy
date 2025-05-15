import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { MFAType } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let disableData
    
    try {
      disableData = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { type } = disableData
    
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
    
    // 检查用户是否已设置了该类型的MFA
    const { data: existingFactor, error: checkError } = await supabase
      .from('user_mfa_factors')
      .select('id')
      .eq('user_id', userId)
      .eq('type', type)
      .single()
    
    if (checkError || !existingFactor) {
      return NextResponse.json(
        { error: `未找到${type}类型的MFA设置` },
        { status: 404 }
      )
    }
    
    // 删除MFA因子
    const { error: deleteError } = await supabase
      .from('user_mfa_factors')
      .delete()
      .eq('id', existingFactor.id)
    
    if (deleteError) {
      console.error('删除MFA因子失败:', deleteError)
      return NextResponse.json(
        { error: '禁用MFA失败' },
        { status: 500 }
      )
    }
    
    // 检查用户是否还有其他已验证的MFA因子
    const { data: remainingFactors, error: countError } = await supabase
      .from('user_mfa_factors')
      .select('id, verified')
      .eq('user_id', userId)
      .eq('verified', true)
    
    // 如果没有其他已验证的MFA因子，更新用户MFA状态为禁用
    if (!remainingFactors || remainingFactors.length === 0) {
      await supabase
        .from('users')
        .update({
          mfa_enabled: false,
          mfa_status: 'disabled',
          mfa_preferred_method: undefined
        })
        .eq('id', userId)
    }
    
    return NextResponse.json({
      success: true,
      message: `${type}类型的MFA已禁用`
    })
    
  } catch (error: any) {
    console.error('禁用MFA错误:', error)
    return NextResponse.json({ 
      error: 'MFA禁用失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 