import { Comment } from './Comment';
import { PaginatedResult } from '@/src/app/shared/domain/PaginatedResult';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: 'createdAt' | 'rating' | 'likes';
  order: 'asc' | 'desc';
}

export interface FilterParams {
  rating?: number;
  hasImages?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CommentQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByProductId(productId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>>;
  findByUserId(userId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>>;
  findByParentId(parentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>>;
  findByProductIdAndUserId(productId: string, userId: string): Promise<Comment | null>;
  save(comment: Comment): Promise<void>;
  update(id: string, comment: Partial<Comment>): Promise<void>;
  delete(id: string): Promise<void>;
  likeComment(commentId: string, userId: string): Promise<void>;
  unlikeComment(commentId: string, userId: string): Promise<void>;
  getCommentLikes(commentId: string): Promise<string[]>;
  getReplyCount(commentId: string): Promise<number>;
} 