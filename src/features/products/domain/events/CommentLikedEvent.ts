import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentLikedEvent extends DomainEvent {
  constructor(
    public readonly comment: Comment,
    public readonly userId: string
  ) {
    super();
  }

  eventName(): string {
    return 'comment.liked';
  }
} 