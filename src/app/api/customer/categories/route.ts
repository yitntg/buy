import { NextResponse } from 'next/server';

// GET处理函数 - 获取分类列表
export async function GET(request: Request) {
  const url = new URL(request.url);
  
  try {
    // 暂时使用旧的API端点来处理请求
    const apiUrl = new URL('/api/customer/categories', url.origin);
    
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error('获取分类列表失败');
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取分类列表时出错:', error);
    return NextResponse.json(
      { error: '获取分类列表失败' },
      { status: 500 }
    );
  }
} 