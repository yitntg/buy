import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentCreatedEvent extends DomainEvent {
  constructor(public readonly comment: Comment) {
    super(comment.id, 'comment.created');
  }

  toPrimitive(): Record<string, any> {
    return {
      commentId: this.comment.id,
      productId: this.comment.productId,
      userId: this.comment.userId,
      content: this.comment.getContent(),
      rating: this.comment.getRating(),
      images: this.comment.getImages(),
      parentId: this.comment.parentId,
      createdAt: this.comment.createdAt,
    };
  }
} 