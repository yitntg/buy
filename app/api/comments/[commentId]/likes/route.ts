import { NextResponse } from 'next/server';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { CommentApi } from '@/features/products/api/CommentApi';

const commentRepository: CommentRepository = new CommentApi();

export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const likes = await commentRepository.getCommentLikes(params.commentId);
    return NextResponse.json({ likes });
  } catch (error) {
    console.error('获取评论点赞列表失败:', error);
    return NextResponse.json({ error: '获取评论点赞列表失败' }, { status: 500 });
  }
} 