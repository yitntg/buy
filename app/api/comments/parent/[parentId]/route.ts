import { container } from '@/infrastructure/container';
import { GetRepliesUseCase } from '@/features/products/application/use-cases/GetRepliesUseCase';

export async function GET(
  request: Request,
  { params }: { params: { parentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const getRepliesUseCase = container.getUseCase<GetRepliesUseCase>('GetRepliesUseCase');
    const result = await getRepliesUseCase.execute({
      commentId: params.parentId,
      params: {
        page,
        pageSize,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc'
      }
    });
    return Response.json(result);
  } catch (error) {
    console.error('Error getting replies:', error);
    return Response.json({ error: 'Failed to get replies' }, { status: 500 });
  }
} 