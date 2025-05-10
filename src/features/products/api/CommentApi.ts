import { Comment } from '../domain/Comment';
import { CommentRepository, CommentQueryParams, PaginatedResult } from '../domain/CommentRepository';

export class CommentApi implements CommentRepository {
  private readonly baseUrl = '/api/comments';

  async findById(id: string): Promise<Comment | null> {
    const response = await fetch(`/api/comments/${id}`);
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
    try {
      const queryParams = new URLSearchParams();
      
      // 添加分页参数
      if (params?.pagination) {
        queryParams.append('page', params.pagination.page.toString());
        queryParams.append('pageSize', params.pagination.pageSize.toString());
      }

      // 添加排序参数
      if (params?.sort) {
        queryParams.append('sortField', params.sort.field);
        queryParams.append('sortOrder', params.sort.order);
      }

      // 添加筛选参数
      if (params?.filter) {
        if (params.filter.rating) {
          queryParams.append('rating', params.filter.rating.toString());
        }
        if (params.filter.hasImages !== undefined) {
          queryParams.append('hasImages', params.filter.hasImages.toString());
        }
        if (params.filter.startDate) {
          queryParams.append('startDate', params.filter.startDate.toISOString());
        }
        if (params.filter.endDate) {
          queryParams.append('endDate', params.filter.endDate.toISOString());
        }
      }

      const response = await fetch(`${this.baseUrl}/product/${productId}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
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
        totalPages: data.totalPages
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    try {
      const queryParams = new URLSearchParams();
      
      // 添加分页参数
      if (params?.pagination) {
        queryParams.append('page', params.pagination.page.toString());
        queryParams.append('pageSize', params.pagination.pageSize.toString());
      }

      // 添加排序参数
      if (params?.sort) {
        queryParams.append('sortField', params.sort.field);
        queryParams.append('sortOrder', params.sort.order);
      }

      // 添加筛选参数
      if (params?.filter) {
        if (params.filter.rating) {
          queryParams.append('rating', params.filter.rating.toString());
        }
        if (params.filter.hasImages !== undefined) {
          queryParams.append('hasImages', params.filter.hasImages.toString());
        }
        if (params.filter.startDate) {
          queryParams.append('startDate', params.filter.startDate.toISOString());
        }
        if (params.filter.endDate) {
          queryParams.append('endDate', params.filter.endDate.toISOString());
        }
      }

      const response = await fetch(`${this.baseUrl}/user/${userId}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
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
        totalPages: data.totalPages
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async findByParentId(parentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const page = params?.pagination?.page || 1;
    const pageSize = params?.pagination?.pageSize || 10;
    const sortField = params?.sort?.field || 'createdAt';
    const sortOrder = params?.sort?.order || 'asc';
    const response = await fetch(`/api/comments?parentId=${parentId}&page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`);
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
      totalPages: data.totalPages
    };
  }

  async save(comment: Comment): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.content,
          rating: comment.rating,
          userId: comment.userId,
          productId: comment.productId,
          parentId: comment.parentId,
          images: comment.images
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

  async update(comment: Comment): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.content,
          rating: comment.rating,
          images: comment.images
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