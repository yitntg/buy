import { NextResponse } from 'next/server';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { CommentApi } from '@/features/products/api/CommentApi';

const commentRepository: CommentRepository = new CommentApi();

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }

    await commentRepository.likeComment(params.commentId, userId);
    return NextResponse.json({ message: '点赞成功' });
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json({ error: '点赞失败' }, { status: 500 });
  }
} 