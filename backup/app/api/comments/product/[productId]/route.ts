import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // 模拟返回分页评论数据
    return NextResponse.json({
      items: [
        {
          id: 'comment-1',
          productId: params.productId,
          userId: 'user-1',
          content: '这是一条测试评论',
          rating: 5,
          createdAt: new Date().toISOString()
        }
      ],
      total: 1,
      page,
      pageSize,
      totalPages: 1,
      hasNext: false,
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error('获取产品评论失败:', error);
    return NextResponse.json({ error: '获取产品评论失败' }, { status: 500 });
  }
} 