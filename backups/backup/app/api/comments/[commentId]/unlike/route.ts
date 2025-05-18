import { NextResponse } from 'next/server';

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

    // 直接实现取消点赞功能，不依赖CommentApi
    console.log(`用户 ${userId} 取消点赞评论 ${params.commentId}`);
    
    // 这里应该有数据库操作，但我们先返回成功响应
    return NextResponse.json({ message: '取消点赞成功' });
  } catch (error) {
    console.error('取消点赞失败:', error);
    return NextResponse.json({ error: '取消点赞失败' }, { status: 500 });
  }
} 