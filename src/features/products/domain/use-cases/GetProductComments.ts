import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';

export class GetProductCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(productId: string): Promise<Comment[]> {
    return this.commentRepository.findByProductId(productId);
  }
} 