import { PrismaClient } from '@prisma/client';
import { Comment } from '../../domain/Comment';
import { CommentRepository, CommentQueryParams } from '../../domain/CommentRepository';
import { PaginatedResult } from '@/shared/domain/PaginatedResult';

export class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(comment: Comment): Promise<void> {
    await this.prisma.comment.upsert({
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
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return null;
    }

    return Comment.create(
      comment.id,
      comment.productId,
      comment.userId,
      comment.content,
      comment.rating,
      comment.images,
      comment.parentId
    );
  }

  async findByProductId(productId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {};

    const [total, items] = await Promise.all([
      this.prisma.comment.count({
        where: { productId }
      }),
      this.prisma.comment.findMany({
        where: { productId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder }
      })
    ]);

    return {
      items: items.map(comment => Comment.create(
        comment.id,
        comment.productId,
        comment.userId,
        comment.content,
        comment.rating,
        comment.images,
        comment.parentId
      )),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }

  async findByUserId(userId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {};

    const [total, items] = await Promise.all([
      this.prisma.comment.count({
        where: { userId }
      }),
      this.prisma.comment.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder }
      })
    ]);

    return {
      items: items.map(comment => Comment.create(
        comment.id,
        comment.productId,
        comment.userId,
        comment.content,
        comment.rating,
        comment.images,
        comment.parentId
      )),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }

  async findByParentId(parentId: string, params?: CommentQueryParams): Promise<PaginatedResult<Comment>> {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {};

    const [total, items] = await Promise.all([
      this.prisma.comment.count({
        where: { parentId }
      }),
      this.prisma.comment.findMany({
        where: { parentId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder }
      })
    ]);

    return {
      items: items.map(comment => Comment.create(
        comment.id,
        comment.productId,
        comment.userId,
        comment.content,
        comment.rating,
        comment.images,
        comment.parentId
      )),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrevious: page > 1
    };
  }

  async findByProductIdAndUserId(productId: string, userId: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findFirst({
      where: { productId, userId }
    });

    if (!comment) {
      return null;
    }

    return Comment.create(
      comment.id,
      comment.productId,
      comment.userId,
      comment.content,
      comment.rating,
      comment.images,
      comment.parentId
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id }
    });
  }

  async update(id: string, comment: Partial<Comment>): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: {
        content: comment.getContent?.(),
        rating: comment.getRating?.(),
        images: comment.getImages?.(),
        updatedAt: new Date()
      }
    });
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    await this.prisma.commentLike.create({
      data: {
        commentId,
        userId
      }
    });
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    await this.prisma.commentLike.delete({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });
  }

  async getCommentLikes(commentId: string): Promise<string[]> {
    const likes = await this.prisma.commentLike.findMany({
      where: { commentId },
      select: { userId: true }
    });

    return likes.map(like => like.userId);
  }

  async getReplyCount(commentId: string): Promise<number> {
    return this.prisma.comment.count({
      where: { parentId: commentId }
    });
  }
} 