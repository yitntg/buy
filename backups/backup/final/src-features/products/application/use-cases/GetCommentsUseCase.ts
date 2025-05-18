import { CommentRepository } from '../../domain/CommentRepository';
import { Comment } from '../../domain/Comment';
import { PaginatedResult } from '@/src/app/shared/domain/PaginatedResult';

export interface GetCommentsQuery {
  productId: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class GetCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentsQuery): Promise<PaginatedResult<Comment>> {
    const { productId, page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    return this.commentRepository.findByProductId(productId, {
      page,
      pageSize,
      sortBy,
      sortOrder
    });
  }
} 