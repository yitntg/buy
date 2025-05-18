import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // 模拟获取单个评论
      return NextResponse.json({
        id,
        content: '评论内容示例',
        rating: 5,
        userId: '1',
        productId: '1',
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 模拟创建评论
    const comment = {
      id: 'comment-' + Date.now(),
      productId: body.productId,
      userId: body.userId,
      content: body.content,
      rating: body.rating,
      images: body.images || [],
      parentId: body.parentId,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('创建评论失败:', error);
    return NextResponse.json({ error: '创建评论失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: '缺少评论ID' }, { status: 400 });
    }

    // 模拟更新评论
    const updatedComment = {
      id,
      content: updateData.content || '更新后的内容',
      rating: updateData.rating || 5,
      images: updateData.images || [],
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('更新评论失败:', error);
    return NextResponse.json({ error: '更新评论失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少评论ID' }, { status: 400 });
    }

    // 模拟删除评论
    return NextResponse.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 });
  }
} 