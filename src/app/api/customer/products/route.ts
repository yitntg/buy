import { NextResponse } from 'next/server';

// GET处理函数 - 获取产品列表
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  try {
    // 这里可以添加实际的业务逻辑，比如从数据库获取产品
    // 暂时使用旧的API端点来处理请求
    const apiUrl = new URL('/api/customer/products', url.origin);
    // 将原请求的所有查询参数复制过来
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });
    
    const response = await fetch(apiUrl.toString());
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取产品列表时出错:', error);
    return NextResponse.json(
      { error: '获取产品列表失败' },
      { status: 500 }
    );
  }
}

// POST处理函数 - 创建新产品
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 调用旧的API端点
    const response = await fetch(`${new URL(request.url).origin}/api/customer/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('创建产品时出错:', error);
    return NextResponse.json(
      { error: '创建产品失败' },
      { status: 500 }
    );
  }
} 