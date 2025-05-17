import { NextResponse } from 'next/server';

// GET处理函数 - 获取用户信息
export async function GET(request: Request) {
  try {
    // 暂时使用旧的API端点来处理请求
    const url = new URL(request.url);
    const apiUrl = new URL('/api/customer/user', url.origin);
    
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error('获取用户信息失败');
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取用户信息时出错:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// POST处理函数 - 更新用户信息
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 调用旧的API端点
    const response = await fetch(`${new URL(request.url).origin}/api/customer/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('更新用户信息时出错:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
} 