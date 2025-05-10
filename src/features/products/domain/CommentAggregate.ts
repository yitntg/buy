import { Comment } from './Comment';
import { CommentCreatedEvent } from './events/CommentCreatedEvent';
import { CommentUpdatedEvent } from './events/CommentUpdatedEvent';
import { CommentDeletedEvent } from './events/CommentDeletedEvent';
import { CommentLikedEvent } from './events/CommentLikedEvent';
import { CommentUnlikedEvent } from './events/CommentUnlikedEvent';
import { CommentRepliedEvent } from './events/CommentRepliedEvent';
import { DomainEvent } from '@/shared/domain/events/DomainEvent';

export class CommentAggregate {
  private domainEvents: DomainEvent[] = [];
  private comments: Map<string, Comment> = new Map();

  constructor(
    public readonly productId: string,
    private readonly userId: string
  ) {}

  createComment(
    content: string,
    rating: number,
    images: string[] = [],
    parentId?: string
  ): Comment {
    const comment = Comment.create(
      crypto.randomUUID(),
      this.productId,
      this.userId,
      content,
      rating,
      images,
      parentId
    );

    this.comments.set(comment.id, comment);
    this.addDomainEvent(new CommentCreatedEvent(comment));
    return comment;
  }

  updateComment(
    commentId: string,
    content: string,
    rating: number
  ): void {
    const comment = this.getComment(commentId);
    comment.update(content, rating);
    this.addDomainEvent(new CommentUpdatedEvent(comment));
  }

  deleteComment(commentId: string): void {
    const comment = this.getComment(commentId);
    comment.delete();
    this.comments.delete(commentId);
    this.addDomainEvent(new CommentDeletedEvent({
      id: commentId,
      productId: this.productId,
      userId: this.userId
    }));
  }

  likeComment(commentId: string, userId: string): void {
    const comment = this.getComment(commentId);
    comment.like(userId);
    this.addDomainEvent(new CommentLikedEvent(comment, userId));
  }

  unlikeComment(commentId: string, userId: string): void {
    const comment = this.getComment(commentId);
    comment.unlike(userId);
    this.addDomainEvent(new CommentUnlikedEvent(comment, userId));
  }

  addReply(
    parentId: string,
    content: string,
    rating: number,
    images: string[] = []
  ): Comment {
    const parentComment = this.getComment(parentId);
    const reply = this.createComment(content, rating, images, parentId);
    parentComment.addReply(reply);
    this.addDomainEvent(new CommentRepliedEvent(parentComment, reply));
    return reply;
  }

  addImage(commentId: string, imageUrl: string): void {
    const comment = this.getComment(commentId);
    comment.addImage(imageUrl);
    this.addDomainEvent(new CommentUpdatedEvent(comment));
  }

  removeImage(commentId: string, imageUrl: string): void {
    const comment = this.getComment(commentId);
    comment.removeImage(imageUrl);
    this.addDomainEvent(new CommentUpdatedEvent(comment));
  }

  getComment(commentId: string): Comment {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error(`评论 ${commentId} 不存在`);
    }
    return comment;
  }

  getComments(): Comment[] {
    return Array.from(this.comments.values());
  }

  getReplies(commentId: string): Comment[] {
    return this.getComments().filter(comment => comment.parentId === commentId);
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }
} 