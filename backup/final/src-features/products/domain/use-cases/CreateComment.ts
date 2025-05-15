import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';

export class CreateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(props: {
    content: string;
    rating: number;
    userId: string;
    productId: string;
    images?: string[];
    parentId?: string;
  }): Promise<Comment> {
    const id = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const comment = Comment.create(
      id,
      props.productId,
      props.userId,
      props.content,
      props.rating,
      props.images || [],
      props.parentId
    );
    await this.commentRepository.save(comment);
    return comment;
  }
} 