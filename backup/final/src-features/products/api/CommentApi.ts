import { Comment } from '../domain/Comment';
import { CommentRepository, CommentQueryParams } from '../domain/CommentRepository';
import { PaginatedResult } from '@/src/app/shared/domain/PaginatedResult';

export class CommentApi implements CommentRepository {
  private readonly baseUrl = '/api/comments';

  async findById(id: string): Promise<Comment | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const item = await response.json();
    if (!item) return null;
    return Comment.create(
      item.id,
      item.productId,
      item.userId,
      item.content,
      item.rating,
      item.images,
      item.parentId
    );
  }

  async findByProductId(productId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const sortBy = params?.sortBy || 'createdAt';
    const sortOrder = params?.sortOrder || 'asc';
    const response = await fetch(`${this.baseUrl}?productId=${productId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await response.json();
    return {
      items: data.items.map((item: any) => Comment.create(
        item.id,
        item.productId,
        item.userId,
        item.content,
        item.rating,
        item.images,
        item.parentId
      )),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      hasNext: data.page < data.totalPages,
      hasPrevious: data.page > 1
    };
  }

  async findByUserId(userId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const sortBy = params?.sortBy || 'createdAt';
    const sortOrder = params?.sortOrder || 'asc';
    const response = await fetch(`${this.baseUrl}?userId=${userId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await response.json();
    return {
      items: data.items.map((item: any) => Comment.create(
        item.id,
        item.productId,
        item.userId,
        item.content,
        item.rating,
        item.images,
        item.parentId
      )),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      hasNext: data.page < data.totalPages,
      hasPrevious: data.page > 1
    };
  }

  async findByParentId(parentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const sortBy = params?.sortBy || 'createdAt';
    const sortOrder = params?.sortOrder || 'asc';
    const response = await fetch(`${this.baseUrl}?parentId=${parentId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await response.json();
    return {
      items: data.items.map((item: any) => Comment.create(
        item.id,
        item.productId,
        item.userId,
        item.content,
        item.rating,
        item.images,
        item.parentId
      )),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      hasNext: data.page < data.totalPages,
      hasPrevious: data.page > 1
    };
  }

  async findByProductIdAndUserId(productId: string, userId: string): Promise<Comment | null> {
    try {
      const response = await fetch(`${this.baseUrl}?productId=${productId}&userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comment');
      }
      const data = await response.json();
      if (!data) return null;
      return Comment.create(
        data.id,
        data.productId,
        data.userId,
        data.content,
        data.rating,
        data.images,
        data.parentId
      );
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw error;
    }
  }

  async save(comment: Comment): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.getContent(),
          rating: comment.getRating(),
          userId: comment.userId,
          productId: comment.productId,
          parentId: comment.parentId,
          images: comment.getImages()
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save comment');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      throw error;
    }
  }

  async update(id: string, comment: Partial<Comment>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.getContent?.(),
          rating: comment.getRating?.(),
          images: comment.getImages?.()
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to like comment');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${commentId}/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to unlike comment');
      }
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }

  async getCommentLikes(commentId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${commentId}/likes`);
      if (!response.ok) {
        throw new Error('Failed to fetch comment likes');
      }
      const data = await response.json();
      return data.likes;
    } catch (error) {
      console.error('Error fetching comment likes:', error);
      throw error;
    }
  }

  async getReplyCount(commentId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/${commentId}/reply-count`);
      if (!response.ok) {
        throw new Error('Failed to fetch reply count');
      }
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error fetching reply count:', error);
      throw error;
    }
  }
} 