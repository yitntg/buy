import { supabase } from '@/shared/infrastructure/lib/supabase';
import { CommentRepository } from '@/features/products/domain/repositories/CommentRepository';
import { Comment } from '@/features/products/domain/entities/Comment';
import { CommentLike } from '@/features/products/domain/entities/CommentLike';
import { CommentId } from '@/features/products/domain/value-objects/CommentId';
import { ProductId } from '@/features/products/domain/value-objects/ProductId';
import { UserId } from '@/features/products/domain/value-objects/UserId';
import { PaginationParams } from '@/shared/domain/types/PaginationParams';
import { PaginatedResult } from '@/shared/domain/types/PaginatedResult';

export class SupabaseCommentRepository implements CommentRepository {
  // 保存或更新评论
  async save(comment: Comment): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .upsert({
        id: comment.id.value,
        product_id: comment.productId.value,
        user_id: comment.userId.value,
        content: comment.content,
        rating: comment.rating,
        images: comment.images,
        parent_id: comment.parentId?.value,
        is_reply: comment.isReply,
        created_at: comment.createdAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`保存评论失败: ${error.message}`);
    }

    return this.mapToComment(data);
  }

  // 通过ID查找评论
  async findById(id: CommentId): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id.value)
      .single();

    if (error) {
      // 记录404以外的错误
      if (error.code !== 'PGRST116') {
        console.error(`查找评论失败: ${error.message}`);
      }
      return null;
    }

    return this.mapToComment(data);
  }

  // 查找产品的所有评论
  async findByProductId(
    productId: ProductId, 
    pagination: PaginationParams
  ): Promise<PaginatedResult<Comment>> {
    // 获取总数
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId.value)
      .is('parent_id', null); // 只获取顶级评论

    if (countError) {
      throw new Error(`获取评论总数失败: ${countError.message}`);
    }

    // 获取分页数据
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId.value)
      .is('parent_id', null) // 只获取顶级评论
      .order('created_at', { ascending: false })
      .range(
        pagination.page * pagination.pageSize,
        (pagination.page + 1) * pagination.pageSize - 1
      );

    if (error) {
      throw new Error(`获取评论列表失败: ${error.message}`);
    }

    return {
      items: data.map(item => this.mapToComment(item)),
      total: count || 0,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  // 查找评论的回复
  async findReplies(
    parentId: CommentId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Comment>> {
    // 获取总数
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', parentId.value);

    if (countError) {
      throw new Error(`获取回复总数失败: ${countError.message}`);
    }

    // 获取分页数据
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('parent_id', parentId.value)
      .order('created_at', { ascending: true })
      .range(
        pagination.page * pagination.pageSize,
        (pagination.page + 1) * pagination.pageSize - 1
      );

    if (error) {
      throw new Error(`获取回复列表失败: ${error.message}`);
    }

    return {
      items: data.map(item => this.mapToComment(item)),
      total: count || 0,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  // 查找用户的评论
  async findByUserId(
    userId: UserId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Comment>> {
    // 获取总数
    const { count, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId.value);

    if (countError) {
      throw new Error(`获取用户评论总数失败: ${countError.message}`);
    }

    // 获取分页数据
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('user_id', userId.value)
      .order('created_at', { ascending: false })
      .range(
        pagination.page * pagination.pageSize,
        (pagination.page + 1) * pagination.pageSize - 1
      );

    if (error) {
      throw new Error(`获取用户评论列表失败: ${error.message}`);
    }

    return {
      items: data.map(item => this.mapToComment(item)),
      total: count || 0,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
  }

  // 删除评论
  async delete(id: CommentId): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id.value);

    if (error) {
      throw new Error(`删除评论失败: ${error.message}`);
    }
  }

  // 更新评论内容
  async update(id: CommentId, content: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id.value);

    if (error) {
      throw new Error(`更新评论失败: ${error.message}`);
    }
  }

  // 点赞评论
  async like(commentId: CommentId, userId: UserId): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId.value,
        user_id: userId.value,
        created_at: new Date().toISOString()
      });

    if (error) {
      // 忽略重复点赞的错误
      if (error.code === '23505') {
        return;
      }
      throw new Error(`点赞评论失败: ${error.message}`);
    }
  }

  // 取消点赞
  async unlike(commentId: CommentId, userId: UserId): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId.value)
      .eq('user_id', userId.value);

    if (error) {
      throw new Error(`取消点赞失败: ${error.message}`);
    }
  }

  // 获取评论的点赞
  async getLikes(commentId: CommentId): Promise<CommentLike[]> {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId.value);

    if (error) {
      throw new Error(`获取点赞列表失败: ${error.message}`);
    }

    return data.map(like => ({
      id: like.id,
      commentId: new CommentId(like.comment_id),
      userId: new UserId(like.user_id),
      createdAt: new Date(like.created_at)
    }));
  }

  // 获取评论数量
  async countByProductId(productId: ProductId): Promise<number> {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId.value);

    if (error) {
      throw new Error(`获取评论数量失败: ${error.message}`);
    }

    return count || 0;
  }

  // 将数据库记录转换为领域对象
  private mapToComment(data: any): Comment {
    return new Comment({
      id: new CommentId(data.id),
      productId: new ProductId(data.product_id),
      userId: new UserId(data.user_id),
      content: data.content,
      rating: data.rating,
      images: data.images || [],
      parentId: data.parent_id ? new CommentId(data.parent_id) : undefined,
      isReply: data.is_reply || false,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }
} 