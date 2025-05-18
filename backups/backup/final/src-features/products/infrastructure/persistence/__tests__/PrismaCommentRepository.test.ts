import { PrismaClient } from '@prisma/client';
import { PrismaCommentRepository } from '../PrismaCommentRepository';
import { Comment } from '../../../domain/Comment';

jest.mock('@prisma/client');

describe('PrismaCommentRepository', () => {
  let repository: PrismaCommentRepository;
  let mockPrisma: jest.Mocked<PrismaClient>;

  const mockComment = {
    id: 'test-id',
    productId: 'test-product-id',
    userId: 'test-user-id',
    content: 'Test comment',
    rating: 5,
    images: ['test-image-1.jpg', 'test-image-2.jpg'],
    parentId: 'test-parent-id',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    repository = new PrismaCommentRepository(mockPrisma);
  });

  describe('save', () => {
    it('should save a new comment', async () => {
      const comment = Comment.create(
        mockComment.id,
        mockComment.productId,
        mockComment.userId,
        mockComment.content,
        mockComment.rating,
        mockComment.images,
        mockComment.parentId
      );

      mockPrisma.comment.upsert.mockResolvedValue(mockComment);

      await repository.save(comment);

      expect(mockPrisma.comment.upsert).toHaveBeenCalledWith({
        where: { id: comment.id },
        create: {
          id: comment.id,
          productId: comment.productId,
          userId: comment.userId,
          content: comment.getContent(),
          rating: comment.getRating(),
          images: comment.getImages(),
          parentId: comment.parentId,
          createdAt: comment.createdAt,
          updatedAt: comment.getUpdatedAt()
        },
        update: {
          content: comment.getContent(),
          rating: comment.getRating(),
          images: comment.getImages(),
          updatedAt: comment.getUpdatedAt()
        }
      });
    });
  });

  describe('findById', () => {
    it('should return a comment by id', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(mockComment);

      const comment = await repository.findById(mockComment.id);

      expect(comment).toBeDefined();
      expect(comment?.id).toBe(mockComment.id);
      expect(comment?.productId).toBe(mockComment.productId);
      expect(comment?.userId).toBe(mockComment.userId);
      expect(comment?.getContent()).toBe(mockComment.content);
      expect(comment?.getRating()).toBe(mockComment.rating);
      expect(comment?.getImages()).toEqual(mockComment.images);
      expect(comment?.parentId).toBe(mockComment.parentId);
    });

    it('should return null when comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);

      const comment = await repository.findById('non-existent-id');

      expect(comment).toBeNull();
    });
  });

  describe('findByProductId', () => {
    it('should return paginated comments for a product', async () => {
      const mockComments = [mockComment];
      const mockTotal = 1;

      mockPrisma.comment.count.mockResolvedValue(mockTotal);
      mockPrisma.comment.findMany.mockResolvedValue(mockComments);

      const result = await repository.findByProductId(mockComment.productId, {
        page: 1,
        pageSize: 10
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(mockTotal);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      mockPrisma.comment.delete.mockResolvedValue(mockComment);

      await repository.delete(mockComment.id);

      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
        where: { id: mockComment.id }
      });
    });
  });

  describe('likeComment', () => {
    it('should like a comment', async () => {
      mockPrisma.commentLike.create.mockResolvedValue({
        commentId: mockComment.id,
        userId: mockComment.userId
      });

      await repository.likeComment(mockComment.id, mockComment.userId);

      expect(mockPrisma.commentLike.create).toHaveBeenCalledWith({
        data: {
          commentId: mockComment.id,
          userId: mockComment.userId
        }
      });
    });
  });

  describe('unlikeComment', () => {
    it('should unlike a comment', async () => {
      mockPrisma.commentLike.delete.mockResolvedValue({
        commentId: mockComment.id,
        userId: mockComment.userId
      });

      await repository.unlikeComment(mockComment.id, mockComment.userId);

      expect(mockPrisma.commentLike.delete).toHaveBeenCalledWith({
        where: {
          commentId_userId: {
            commentId: mockComment.id,
            userId: mockComment.userId
          }
        }
      });
    });
  });

  describe('getCommentLikes', () => {
    it('should return comment likes', async () => {
      const mockLikes = [
        { userId: 'user-1' },
        { userId: 'user-2' }
      ];

      mockPrisma.commentLike.findMany.mockResolvedValue(mockLikes);

      const likes = await repository.getCommentLikes(mockComment.id);

      expect(likes).toEqual(['user-1', 'user-2']);
    });
  });

  describe('getReplyCount', () => {
    it('should return reply count', async () => {
      const mockCount = 5;

      mockPrisma.comment.count.mockResolvedValue(mockCount);

      const count = await repository.getReplyCount(mockComment.id);

      expect(count).toBe(mockCount);
    });
  });
}); 