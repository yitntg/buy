import { CommentRepository, CommentQueryParams } from '../../features/products/domain/CommentRepository';
import { Comment } from '../../features/products/domain/Comment';
import { PaginatedResult } from '../../shared/domain/PaginatedResult';
import { supabase } from '../../lib/supabase';

export class CommentRepositoryImpl implements CommentRepository {
  async findById(id: string): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return Comment.create(
      data.id,
      data.product_id,
      data.user_id,
      data.content,
      data.rating,
      data.images || [],
      data.parent_id
    );
  }

  async findByProductId(productId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = params || {};
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .is('parent_id', null)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(start, end);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      items: (data || []).map(comment => 
        Comment.create(
          comment.id,
          comment.product_id,
          comment.user_id,
          comment.content,
          comment.rating,
          comment.images || [],
          comment.parent_id
        )
      ),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  async findByUserId(userId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = params || {};
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(start, end);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      items: (data || []).map(comment => 
        Comment.create(
          comment.id,
          comment.product_id,
          comment.user_id,
          comment.content,
          comment.rating,
          comment.images || [],
          comment.parent_id
        )
      ),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  async findByParentId(parentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = params || {};
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('parent_id', parentId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(start, end);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      items: (data || []).map(comment => 
        Comment.create(
          comment.id,
          comment.product_id,
          comment.user_id,
          comment.content,
          comment.rating,
          comment.images || [],
          comment.parent_id
        )
      ),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  async findByProductIdAndUserId(productId: string, userId: string): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return Comment.create(
      data.id,
      data.product_id,
      data.user_id,
      data.content,
      data.rating,
      data.images || [],
      data.parent_id
    );
  }

  async save(comment: Comment): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .insert({
        id: comment.id,
        product_id: comment.productId,
        user_id: comment.userId,
        content: comment.getContent(),
        rating: comment.getRating(),
        images: comment.getImages(),
        parent_id: comment.parentId,
        created_at: comment.createdAt,
        updated_at: comment.getUpdatedAt()
      });

    if (error) throw error;
  }

  async update(id: string, comment: Partial<Comment>): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({
        content: comment.getContent?.(),
        rating: comment.getRating?.(),
        images: comment.getImages?.(),
        updated_at: comment.getUpdatedAt?.() || new Date()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: userId });

    if (error) throw error;
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getCommentLikes(commentId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('user_id')
      .eq('comment_id', commentId);

    if (error) throw error;
    return data.map((like: { user_id: string }) => like.user_id);
  }

  async getReplyCount(commentId: string): Promise<number> {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('parent_id', commentId);

    if (error) throw error;
    return count || 0;
  }
} 