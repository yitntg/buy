import { CommentRepository } from '../../domain/CommentRepository';
import { EventBus } from '@/src/app/shared/domain/events/EventBus';
import { CommentCreatedEvent } from '../../domain/events/CommentCreatedEvent';
import { Comment } from '../../domain/Comment';

export class CreateCommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private eventBus: EventBus
  ) {}

  async execute({ productId, userId, content, rating, images }: { productId: string; userId: string; content: string; rating: number; images: string[] }): Promise<Comment> {
    const comment = Comment.create(
      'temp-' + Date.now(),
      productId,
      userId,
      content,
      rating,
      images
    );
    await this.commentRepository.save(comment);
    // 发布领域事件
    this.eventBus.publish(new CommentCreatedEvent(comment));
    return comment;
  }
} 