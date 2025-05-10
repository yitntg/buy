import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentUpdatedEvent extends DomainEvent {
  constructor(public readonly comment: Comment) {
    super();
  }

  eventName(): string {
    return 'comment.updated';
  }
} 