import { Comment } from '../../domain/Comment';
import { CommentQueryParams } from '../../domain/CommentRepository';
import { PaginatedResult } from '@/src/app/shared/domain/PaginatedResult';
import { CommentRepository } from '../../domain/CommentRepository';

export class GetRepliesUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(commentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    return this.commentRepository.findByParentId(commentId, params);
  }
} 