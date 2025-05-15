import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    // 直接返回回复数为0
    return NextResponse.json({
      count: 0
    });
  } catch (error) {
    console.error('获取回复数量失败:', error);
    return NextResponse.json({ error: '获取回复数量失败' }, { status: 500 });
  }
} 