import { NextResponse } from 'next/server';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { CommentApi } from '@/features/products/api/CommentApi';

const commentRepository: CommentRepository = new CommentApi();

export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const count = await commentRepository.getReplyCount(params.commentId);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('获取评论回复数失败:', error);
    return NextResponse.json({ error: '获取评论回复数失败' }, { status: 500 });
  }
} 