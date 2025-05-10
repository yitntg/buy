import { DomainEvent } from '@/shared/domain/events/DomainEvent';
import { Comment } from '../Comment';

export class CommentDeletedEvent extends DomainEvent {
  constructor(public readonly comment: Comment) {
    super();
  }

  eventName(): string {
    return 'comment.deleted';
  }
} 