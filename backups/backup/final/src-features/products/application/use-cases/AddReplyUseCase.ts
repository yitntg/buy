import { CommentRepository } from '../../domain/CommentRepository';
import { EventBus } from '@/src/app/shared/domain/events/EventBus';
import { CommentCreatedEvent } from '../../domain/events/CommentCreatedEvent';
import { Comment } from '../../domain/Comment';

export class AddReplyUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private eventBus: EventBus
  ) {}

  async execute({ parentId, productId, userId, content, rating, images }: { parentId: string; productId: string; userId: string; content: string; rating: number; images: string[] }): Promise<void> {
    const reply = Comment.create(
      'temp-' + Date.now(),
      productId,
      userId,
      content,
      rating,
      images,
      parentId
    );
    await this.commentRepository.save(reply);
    // 发布领域事件
    this.eventBus.publish(new CommentCreatedEvent(reply));
  }
} 