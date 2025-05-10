import { CommentAggregate } from '../../domain/CommentAggregate';
import { CommentRepository } from '../../domain/CommentRepository';
import { EventBus } from '@/shared/domain/events/EventBus';
import { CommentUnlikedEvent } from '../../domain/events/CommentUnlikedEvent';
import { Comment } from '../../domain/Comment';

export interface UnlikeCommentCommand {
  commentId: string;
  productId: string;
  userId: string;
}

export class UnlikeCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute({ commentId, productId, userId }: { commentId: string; productId: string; userId: string }): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error(`评论 ${commentId} 不存在`);
    }

    await this.commentRepository.unlikeComment(commentId, userId);
    // 发布领域事件
    this.eventBus.publish(new CommentUnlikedEvent(comment));
  }
} 