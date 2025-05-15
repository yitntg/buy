import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/infrastructure/lib/supabase'
import bcrypt from 'bcrypt'

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
    
    const { id, username, email, phone, avatar, currentPassword, newPassword } = userData
    
    // 验证必填字段
    if (!id) {
      return NextResponse.json(
        { error: '用户ID是必填字段' },
        { status: 400 }
      )
    }
    
    // 检查用户是否存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (checkError || !existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 如果更新邮箱，检查邮箱是否已被其他用户使用
    if (email && email !== existingUser.email) {
      const { data: emailExists, error: emailCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single()
      
      if (emailExists) {
        return NextResponse.json(
          { error: '该邮箱已被其他用户注册' },
          { status: 409 }
        )
      }
    }
    
    // 如果要更改密码，验证当前密码
    if (newPassword) {
      // 密码强度验证
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: '新密码长度必须至少为8个字符' },
          { status: 400 }
        )
      }
      
      // 必须提供当前密码以验证身份
      if (!currentPassword) {
        return NextResponse.json(
          { error: '更改密码需要提供当前密码' },
          { status: 400 }
        )
      }
      
      // 验证当前密码
      try {
        const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password_hash)
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: '当前密码错误' },
            { status: 401 }
          )
        }
      } catch (e) {
        return NextResponse.json(
          { error: '密码验证错误' },
          { status: 500 }
        )
      }
    }
    
    console.log(`更新用户资料: ${id}`)
    
    // 构建更新数据
    const updates: Record<string, any> = {}
    
    // 只更新提供的字段
    if (username) updates.username = username
    if (email) updates.email = email
    if (phone) updates.phone = phone
    if (avatar) updates.avatar = avatar
    
    // 如果要更新密码，生成新的密码哈希
    if (newPassword) {
      updates.password_hash = await bcrypt.hash(newPassword, 10)
    }
    
    // 更新时间戳
    updates.updated_at = new Date().toISOString()
    
    // 更新用户数据
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新用户资料失败:', error)
      return NextResponse.json({ 
        error: '更新资料失败', 
        details: error.message 
      }, { status: 500 })
    }
    
    // 移除敏感信息
    if (updatedUser && updatedUser.password_hash) {
      delete updatedUser.password_hash
    }
    
    return NextResponse.json({
      user: updatedUser,
      message: '资料更新成功'
    })
  } catch (error: any) {
    console.error('更新用户资料错误:', error)
    return NextResponse.json({ 
      error: '更新资料失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 
