import { DomainEvent } from '@/src/app/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentRepliedEvent extends DomainEvent {
  constructor(
    public readonly comment: Comment,
    public readonly replyToId: string,
    public readonly userId: string
  ) {
    super();
  }

  eventName(): string {
    return 'comment.replied';
  }
} 