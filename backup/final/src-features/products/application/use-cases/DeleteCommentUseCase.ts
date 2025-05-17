import { CommentAggregate } from '../../domain/CommentAggregate';
import { CommentRepository } from '../../domain/CommentRepository';
import { EventBus } from '@/src/app/shared/domain/events/EventBus';
import { CommentDeletedEvent } from '../../domain/events/CommentDeletedEvent';
import { Comment } from '../../domain/Comment';

export interface DeleteCommentCommand {
  commentId: string;
  productId: string;
  userId: string;
}

export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(command.commentId);
    if (!comment) {
      throw new Error(`评论 ${command.commentId} 不存在`);
    }

    if (comment.userId !== command.userId) {
      throw new Error('无权删除此评论');
    }

    const aggregate = new CommentAggregate(command.productId, command.userId);
    aggregate.deleteComment(command.commentId);

    await this.commentRepository.delete(command.commentId);
    
    const events = aggregate.getDomainEvents();
    await this.eventBus.publishAll(events);

    // 发布领域事件
    this.eventBus.publish(new CommentDeletedEvent(comment));
  }
} 