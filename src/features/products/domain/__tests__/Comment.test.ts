import { Comment } from '../Comment';
import { CommentCreatedEvent } from '../events/CommentCreatedEvent';

describe('Comment', () => {
  const mockComment = {
    id: 'test-id',
    productId: 'test-product-id',
    userId: 'test-user-id',
    content: 'Test comment',
    rating: 5,
    images: ['test-image-1.jpg', 'test-image-2.jpg'],
    parentId: 'test-parent-id'
  };

  it('should create a comment with correct properties', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    expect(comment.id).toBe(mockComment.id);
    expect(comment.productId).toBe(mockComment.productId);
    expect(comment.userId).toBe(mockComment.userId);
    expect(comment.getContent()).toBe(mockComment.content);
    expect(comment.getRating()).toBe(mockComment.rating);
    expect(comment.getImages()).toEqual(mockComment.images);
    expect(comment.parentId).toBe(mockComment.parentId);
  });

  it('should add CommentCreatedEvent when creating a comment', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    const events = comment.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(CommentCreatedEvent);
  });

  it('should update content correctly', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    const newContent = 'Updated content';
    comment.updateContent(newContent);
    expect(comment.getContent()).toBe(newContent);
  });

  it('should update rating correctly', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    const newRating = 4;
    comment.updateRating(newRating);
    expect(comment.getRating()).toBe(newRating);
  });

  it('should update images correctly', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    const newImages = ['new-image-1.jpg', 'new-image-2.jpg'];
    comment.updateImages(newImages);
    expect(comment.getImages()).toEqual(newImages);
  });

  it('should clear domain events', () => {
    const comment = Comment.create(
      mockComment.id,
      mockComment.productId,
      mockComment.userId,
      mockComment.content,
      mockComment.rating,
      mockComment.images,
      mockComment.parentId
    );

    expect(comment.getDomainEvents()).toHaveLength(1);
    comment.clearDomainEvents();
    expect(comment.getDomainEvents()).toHaveLength(0);
  });
}); 