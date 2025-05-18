import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';

export interface UpdateCommentProps {
  id: string;
  content: string;
  rating: number;
  images?: string[];
}

export class UpdateComment {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(props: UpdateCommentProps): Promise<void> {
    const comment = await this.commentRepository.findById(props.id);
    if (!comment) {
      throw new Error(`评论 ${props.id} 不存在`);
    }

    comment.update(props.content, props.rating);
    if (props.images) {
      comment.updateImages(props.images);
    }

    await this.commentRepository.save(comment);
  }
} 