import { CommentRepository } from '../../domain/CommentRepository';
import { Comment } from '../../domain/Comment';

export interface GetCommentQuery {
  commentId: string;
}

export class GetCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentQuery): Promise<Comment | null> {
    return this.commentRepository.findById(query.commentId);
  }
} 