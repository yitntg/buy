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
  }): Promise<Comment> {
    const comment = Comment.create(props);
    await this.commentRepository.save(comment);
    return comment;
  }
} 