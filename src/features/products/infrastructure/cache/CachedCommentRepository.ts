import { Comment } from '../../domain/Comment';
import { CommentRepository, CommentQueryParams, PaginatedResult } from '../../domain/CommentRepository';
import { Redis } from 'ioredis';

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

  async delete(id: string): Promise<void> {
    const comment = await this.repository.findById(id);
    if (comment) {
      await this.repository.delete(id);
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
      this.getProductCommentsKey(comment.productId)
    ];

    if (comment.parentId) {
      keys.push(this.getParentRepliesKey(comment.parentId));
    }

    await Promise.all(keys.map(key => this.redis.del(key)));
  }
} 