import { DomainEvent } from '@/src/app/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentDeletedEvent extends DomainEvent {
  constructor(public readonly comment: Comment) {
    super(
      comment.id.toString(), // aggregateId
      'comment.deleted' // eventType
    );
  }

  eventName(): string {
    return 'comment.deleted';
  }
  
  // 实现抽象方法
  toPrimitive(): Record<string, any> {
    return {
      id: this.comment.id,
      commentId: this.comment.id,
      productId: this.comment.productId,
      userId: this.comment.userId,
      content: this.comment.getContent(),
      rating: this.comment.getRating(),
      images: this.comment.getImages(),
      eventName: this.eventName(),
      occurredOn: this.occurredOn
    };
  }
} 