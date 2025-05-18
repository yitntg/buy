import { CommentCreatedEvent } from './events/CommentCreatedEvent';
import { CommentUpdatedEvent } from './events/CommentUpdatedEvent';
import { CommentDeletedEvent } from './events/CommentDeletedEvent';
import { CommentLikedEvent } from './events/CommentLikedEvent';
import { CommentUnlikedEvent } from './events/CommentUnlikedEvent';
import { CommentRepliedEvent } from './events/CommentRepliedEvent';
import { DomainEvent } from '@/src/app/shared/domain/events/DomainEvent';

export class Comment {
  private domainEvents: DomainEvent[] = [];
  private likes: string[] = [];

  private constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly userId: string,
    private content: string,
    private rating: number,
    private images: string[],
    public readonly parentId?: string,
    public readonly createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  static create(
    id: string,
    productId: string,
    userId: string,
    content: string,
    rating: number,
    images: string[] = [],
    parentId?: string
  ): Comment {
    const comment = new Comment(id, productId, userId, content, rating, images, parentId);
    comment.addDomainEvent(new CommentCreatedEvent(comment));
    return comment;
  }

  updateContent(content: string): void {
    this.content = content;
    this._updatedAt = new Date();
  }

  updateRating(rating: number): void {
    this.rating = rating;
    this._updatedAt = new Date();
  }

  update(content: string, rating: number): void {
    this.updateContent(content);
    this.updateRating(rating);
    this.addDomainEvent(new CommentUpdatedEvent(this));
  }

  updateImages(images: string[]): void {
    this.images = images;
    this._updatedAt = new Date();
  }

  getContent(): string {
    return this.content;
  }

  getRating(): number {
    return this.rating;
  }

  getImages(): string[] {
    return [...this.images];
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }

  delete(): void {
    this.addDomainEvent(new CommentDeletedEvent(this));
  }

  addImage(imageUrl: string): void {
    this.images.push(imageUrl);
    this._updatedAt = new Date();
    this.addDomainEvent(new CommentUpdatedEvent(this));
  }

  removeImage(imageUrl: string): void {
    this.images = this.images.filter(img => img !== imageUrl);
    this._updatedAt = new Date();
    this.addDomainEvent(new CommentUpdatedEvent(this));
  }

  like(userId: string): void {
    if (!this.likes.includes(userId)) {
      this.likes.push(userId);
      this._updatedAt = new Date();
      this.addDomainEvent(new CommentLikedEvent(this, userId));
    }
  }

  unlike(userId: string): void {
    if (this.likes.includes(userId)) {
      this.likes = this.likes.filter(id => id !== userId);
      this._updatedAt = new Date();
      this.addDomainEvent(new CommentUnlikedEvent(this, userId));
    }
  }

  addReply(reply: Comment): void {
    this.addDomainEvent(new CommentRepliedEvent(this, reply.id, reply.userId));
  }

  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }
} 