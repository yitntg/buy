import { Comment } from '../../domain/Comment';
import { CommentRepository, CommentQueryParams } from '../../domain/CommentRepository';
import { Redis } from 'ioredis';
import { PaginatedResult } from '@/shared/domain/PaginatedResult';

export class CachedCommentRepository implements CommentRepository {
  private readonly redis: Redis;
  private readonly TTL = 3600; // 1小时缓存过期

  constructor(
    private readonly repository: CommentRepository,
    redisUrl: string
  ) {
    this.redis = new Redis(redisUrl);
  }

  private getCacheKey(id: string): string {
    return `comment:${id}`;
  }

  private getProductCommentsKey(productId: string): string {
    return `product:${productId}:comments`;
  }

  private getParentRepliesKey(parentId: string): string {
    return `comment:${parentId}:replies`;
  }

  private getUserCommentsKey(userId: string): string {
    return `user:${userId}:comments`;
  }

  async save(comment: Comment): Promise<void> {
    await this.repository.save(comment);
    await this.invalidateCache(comment);
  }

  async findById(id: string): Promise<Comment | null> {
    const cacheKey = this.getCacheKey(id);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const comment = await this.repository.findById(id);
    if (comment) {
      await this.redis.setex(cacheKey, this.TTL, JSON.stringify(comment));
    }

    return comment;
  }

  async findByProductId(
    productId: string,
    params?: CommentQueryParams
  ): Promise<PaginatedResult<Comment>> {
    const cacheKey = this.getProductCommentsKey(productId);
    const cached = await this.redis.get(cacheKey);

    if (cached && !params) {
      return JSON.parse(cached);
    }

    const result = await this.repository.findByProductId(productId, params);
    if (!params) {
      await this.redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    }

    return result;
  }

  async findByParentId(
    parentId: string,
    params?: CommentQueryParams
  ): Promise<PaginatedResult<Comment>> {
    const cacheKey = this.getParentRepliesKey(parentId);
    const cached = await this.redis.get(cacheKey);

    if (cached && !params) {
      return JSON.parse(cached);
    }

    const result = await this.repository.findByParentId(parentId, params);
    if (!params) {
      await this.redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    }

    return result;
  }

  async findByUserId(
    userId: string, 
    params?: CommentQueryParams
  ): Promise<PaginatedResult<Comment>> {
    const cacheKey = this.getUserCommentsKey(userId);
    const cached = await this.redis.get(cacheKey);

    if (cached && !params) {
      return JSON.parse(cached);
    }

    const result = await this.repository.findByUserId(userId, params);
    if (!params) {
      await this.redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    }

    return result;
  }

  async findByProductIdAndUserId(
    productId: string,
    userId: string
  ): Promise<Comment | null> {
    // 这种查询较为特殊，不做缓存处理
    return this.repository.findByProductIdAndUserId(productId, userId);
  }

  async update(id: string, comment: Partial<Comment>): Promise<void> {
    await this.repository.update(id, comment);
    
    // 查找完整评论以便无效化缓存
    const fullComment = await this.repository.findById(id);
    if (fullComment) {
      await this.invalidateCache(fullComment);
    }
  }

  async delete(id: string): Promise<void> {
    const comment = await this.repository.findById(id);
    if (comment) {
      await this.repository.delete(id);
      await this.invalidateCache(comment);
    }
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    await this.repository.likeComment(commentId, userId);
    
    // 无效化评论缓存
    const comment = await this.repository.findById(commentId);
    if (comment) {
      await this.invalidateCache(comment);
    }
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    await this.repository.unlikeComment(commentId, userId);
    
    // 无效化评论缓存
    const comment = await this.repository.findById(commentId);
    if (comment) {
      await this.invalidateCache(comment);
    }
  }

  async getCommentLikes(commentId: string): Promise<string[]> {
    return this.repository.getCommentLikes(commentId);
  }

  async getReplyCount(commentId: string): Promise<number> {
    return this.repository.getReplyCount(commentId);
  }

  private async invalidateCache(comment: Comment): Promise<void> {
    const keys = [
      this.getCacheKey(comment.id),
      this.getProductCommentsKey(comment.productId),
      this.getUserCommentsKey(comment.userId)
    ];

    if (comment.parentId) {
      keys.push(this.getParentRepliesKey(comment.parentId));
    }

    await Promise.all(keys.map(key => this.redis.del(key)));
  }
} 