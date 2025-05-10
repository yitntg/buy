import { CommentAggregate } from '../../domain/CommentAggregate';
import { CommentRepository } from '../../domain/CommentRepository';
import { EventBus } from '@/shared/domain/events/EventBus';
import { CommentLikedEvent } from '../../domain/events/CommentLikedEvent';

export interface LikeCommentCommand {
  commentId: string;
  productId: string;
  userId: string;
}

export class LikeCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute({ commentId, productId, userId }: { commentId: string; productId: string; userId: string }): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error(`评论 ${commentId} 不存在`);
    }

    const aggregate = new CommentAggregate(productId, userId);
    aggregate.likeComment(commentId, userId);

    await this.commentRepository.save(comment);
    
    const events = aggregate.getDomainEvents();
    await this.eventBus.publishAll(events);

    // 发布领域事件
    this.eventBus.publish(new CommentLikedEvent(comment, userId));
  }
} 