import { DomainEvent } from '@/src/app/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentUpdatedEvent extends DomainEvent {
  constructor(public readonly comment: Comment) {
    super(
      comment.id.toString(),
      'comment.updated'
    );
  }

  eventName(): string {
    return 'comment.updated';
  }
  
  toPrimitive(): Record<string, any> {
    return {
      commentId: this.comment.id,
      productId: this.comment.productId,
      userId: this.comment.userId,
      content: this.comment.getContent(),
      rating: this.comment.getRating(),
      images: this.comment.getImages(),
      updatedAt: this.comment.getUpdatedAt(),
      eventName: this.eventName(),
      occurredOn: this.occurredOn
    };
  }
} 