import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';
import { CommentAggregate } from '../CommentAggregate';
import { CommentCreatedEvent } from '../events/CommentCreatedEvent';
import { CommentUpdatedEvent } from '../events/CommentUpdatedEvent';
import { CommentDeletedEvent } from '../events/CommentDeletedEvent';
import { EventBus } from '@/shared/domain/events/EventBus';

export class CommentDomainService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly eventBus: EventBus
  ) {}

  async createComment(params: {
    productId: string;
    userId: string;
    content: string;
    rating: number;
    images?: string[];
    parentId?: string;
  }): Promise<Comment> {
    // 检查是否已存在评论
    const existingComment = await this.commentRepository.findByProductIdAndUserId(
      params.productId,
      params.userId
    );

    if (existingComment) {
      throw new Error('您已经评论过该商品');
    }

    // 创建评论
    const comment = Comment.create(
      'temp-' + Date.now(),
      params.productId,
      params.userId,
      params.content,
      params.rating,
      params.images || [],
      params.parentId
    );

    // 保存评论
    await this.commentRepository.save(comment);

    // 发布领域事件
    await this.eventBus.publish(new CommentCreatedEvent(comment));

    return comment;
  }

  async updateComment(params: {
    commentId: string;
    userId: string;
    content?: string;
    rating?: number;
    images?: string[];
  }): Promise<void> {
    const comment = await this.commentRepository.findById(params.commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 检查权限
    if (comment.userId !== params.userId) {
      throw new Error('无权修改此评论');
    }

    // 更新评论
    if (params.content) {
      comment.updateContent(params.content);
    }
    if (params.rating) {
      comment.updateRating(params.rating);
    }
    if (params.images) {
      comment.updateImages(params.images);
    }

    // 保存更新
    await this.commentRepository.save(comment);

    // 发布领域事件
    await this.eventBus.publish(new CommentUpdatedEvent(comment));

    return comment;
  }

  async deleteComment(params: {
    commentId: string;
    userId: string;
  }): Promise<void> {
    // 获取评论
    const comment = await this.commentRepository.findById(params.commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 检查权限
    if (comment.userId !== params.userId) {
      throw new Error('无权删除此评论');
    }

    // 创建聚合根
    const aggregate = new CommentAggregate(comment.productId, comment.userId);
    aggregate.deleteComment(params.commentId);

    // 删除评论
    await this.commentRepository.delete(params.commentId);

    // 发布领域事件
    await this.eventBus.publish(new CommentDeletedEvent(comment));
  }

  async likeComment(params: {
    commentId: string;
    userId: string;
  }): Promise<void> {
    // 获取评论
    const comment = await this.commentRepository.findById(params.commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 检查是否已点赞
    const likes = await this.commentRepository.getCommentLikes(params.commentId);
    if (likes.includes(params.userId)) {
      throw new Error('您已经点赞过此评论');
    }

    // 点赞评论
    await this.commentRepository.likeComment(params.commentId, params.userId);
  }

  async unlikeComment(params: {
    commentId: string;
    userId: string;
  }): Promise<void> {
    // 获取评论
    const comment = await this.commentRepository.findById(params.commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 检查是否已点赞
    const likes = await this.commentRepository.getCommentLikes(params.commentId);
    if (!likes.includes(params.userId)) {
      throw new Error('您还没有点赞此评论');
    }

    // 取消点赞
    await this.commentRepository.unlikeComment(params.commentId, params.userId);
  }

  async getCommentWithReplies(commentId: string): Promise<{
    comment: Comment;
    replies: Comment[];
    replyCount: number;
    likes: string[];
  }> {
    // 获取评论
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('评论不存在');
    }

    // 获取回复
    const replies = await this.commentRepository.findByParentId(commentId);

    // 获取回复数量
    const replyCount = await this.commentRepository.getReplyCount(commentId);

    // 获取点赞
    const likes = await this.commentRepository.getCommentLikes(commentId);

    return {
      comment,
      replies,
      replyCount,
      likes,
    };
  }
} 