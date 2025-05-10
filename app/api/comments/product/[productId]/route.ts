import { NextResponse } from 'next/server';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { CommentApi } from '@/features/products/api/CommentApi';

const commentRepository: CommentRepository = new CommentApi();

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined;
    const hasImages = searchParams.get('hasImages') === 'true' ? true : 
                     searchParams.get('hasImages') === 'false' ? false : undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    const result = await commentRepository.findByProductId(params.productId, {
      pagination: { page, pageSize },
      sort: { field: sortField as any, order: sortOrder as any },
      filter: { rating, hasImages, startDate, endDate }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('获取商品评论失败:', error);
    return NextResponse.json({ error: '获取商品评论失败' }, { status: 500 });
  }
} 