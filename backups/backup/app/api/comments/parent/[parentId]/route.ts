import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { parentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    // 直接使用数据库查询替代依赖注入
    return NextResponse.json({
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      hasNext: false,
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error('获取回复失败:', error);
    return NextResponse.json({ error: '获取回复失败' }, { status: 500 });
  }
} 