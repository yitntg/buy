import { NextResponse } from 'next/server';
import { AvatarService } from '@/utils/avatarUtils';
import { initializeStorage } from '@/utils/storage';

export async function GET() {
  try {
    // 初始化产品存储
    const productsInitSuccess = await initializeStorage();
    if (!productsInitSuccess) {
      console.error('产品存储初始化失败');
    }
    
    // 初始化头像存储
    const avatarsInitSuccess = await AvatarService.initializeAvatarStorage();
    
    if (productsInitSuccess && avatarsInitSuccess) {
      return NextResponse.json({ message: '存储服务初始化成功' });
    } else {
      const errors = [];
      if (!productsInitSuccess) errors.push('产品存储初始化失败');
      if (!avatarsInitSuccess) errors.push('头像存储初始化失败');
      
      return NextResponse.json({ error: '存储初始化部分失败', details: errors }, { status: 500 });
    }
  } catch (error) {
    console.error('存储初始化失败:', error);
    return NextResponse.json(
      { error: '存储初始化失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 