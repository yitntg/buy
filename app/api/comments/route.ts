import { NextResponse } from 'next/server';
import { Comment } from '@/features/products/domain/Comment';
import { CommentRepository } from '@/features/products/domain/CommentRepository';
import { CommentApi } from '@/features/products/api/CommentApi';

const commentRepository: CommentRepository = new CommentApi();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const comment = await commentRepository.findById(id);
      if (!comment) {
        return NextResponse.json({ error: '评论不存在' }, { status: 404 });
      }
      return NextResponse.json(comment);
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
    const comment = Comment.create(
      'temp-' + Date.now(),
      body.productId,
      body.userId,
      body.content,
      body.rating,
      body.images || [],
      body.parentId
    );
    await commentRepository.save(comment);
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
    
    const comment = await commentRepository.findById(id);
    if (!comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 });
    }

    if (updateData.content) {
      comment.updateContent(updateData.content);
    }
    if (updateData.rating) {
      comment.updateRating(updateData.rating);
    }
    if (updateData.images) {
      comment.updateImages(updateData.images);
    }

    await commentRepository.update(id, comment);
    return NextResponse.json(comment);
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

    await commentRepository.delete(id);
    return NextResponse.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 });
  }
} 