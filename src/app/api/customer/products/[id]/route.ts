import { NextResponse } from 'next/server';

/**
 * 获取产品详情API
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 暂时使用旧的API端点来处理请求
    const url = new URL(request.url);
    const apiUrl = new URL(`/api/customer/products/${id}`, url.origin);
    
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const errorStatus = response.status;
      if (errorStatus === 404) {
        return NextResponse.json(
          { error: '产品不存在' },
          { status: 404 }
        );
      }
      throw new Error(`获取产品详情失败: ${errorStatus}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取产品详情时出错:', error);
    return NextResponse.json(
      { error: '获取产品详情失败' },
      { status: 500 }
    );
  }
} 