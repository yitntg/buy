import { CommentRepository } from '../../domain/CommentRepository';
import { CommentQueryParams, PaginatedResult } from '../../domain/CommentRepository';
import { Comment } from '../../domain/Comment';

export interface GetRepliesQuery {
  commentId: string;
  params?: CommentQueryParams;
}

export class GetRepliesUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetRepliesQuery): Promise<PaginatedResult<Comment>> {
    return this.commentRepository.findByParentId(query.commentId, query.params);
  }
} 