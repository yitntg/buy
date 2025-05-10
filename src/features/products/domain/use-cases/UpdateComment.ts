import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';

export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(id: string, props: {
    content?: string;
    rating?: number;
    images?: string[];
  }): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new Error('评论不存在');
    }

    if (props.content) {
      comment.updateContent(props.content);
    }

    if (props.rating) {
      comment.updateRating(props.rating);
    }

    if (props.images) {
      // 清除现有图片
      comment.images?.forEach(image => comment.removeImage(image));
      // 添加新图片
      props.images.forEach(image => comment.addImage(image));
    }

    await this.commentRepository.update(comment);
    return comment;
  }
} 