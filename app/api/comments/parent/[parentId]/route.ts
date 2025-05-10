import { NextResponse } from 'next/server';
import { container } from '@/src/infrastructure/container';
import { GetRepliesUseCase } from '@/src/features/products/application/use-cases/GetRepliesUseCase';

export async function GET(
  request: Request,
  { params }: { params: { parentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const getRepliesUseCase = container.resolve(GetRepliesUseCase);
    const result = await getRepliesUseCase.execute({
      parentId: params.parentId,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting replies:', error);
    return NextResponse.json(
      { error: '获取回复列表失败' },
      { status: 500 }
    );
  }
} 