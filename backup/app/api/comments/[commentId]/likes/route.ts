import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    // 直接返回空的点赞列表
    return NextResponse.json({
      likes: []
    });
  } catch (error) {
    console.error('获取评论点赞失败:', error);
    return NextResponse.json({ error: '获取评论点赞失败' }, { status: 500 });
  }
} 