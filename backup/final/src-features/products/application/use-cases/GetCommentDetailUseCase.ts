import { CommentRepository } from '../../domain/CommentRepository';
import { Comment } from '../../domain/Comment';
import { PaginatedResult } from '@/src/app/shared/domain/PaginatedResult';

export interface GetCommentDetailQuery {
  commentId: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CommentDetailResult {
  comment: Comment;
  replies: PaginatedResult<Comment>;
  replyCount: number;
  likes: string[];
}

export class GetCommentDetailUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentDetailQuery): Promise<CommentDetailResult> {
    const { commentId, page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    const replies = await this.commentRepository.findByParentId(commentId, {
      page,
      pageSize,
      sortBy,
      sortOrder
    });

    const replyCount = await this.commentRepository.getReplyCount(commentId);
    const likes = await this.commentRepository.getCommentLikes(commentId);

    return {
      comment,
      replies,
      replyCount,
      likes
    };
  }
} 