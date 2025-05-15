import { Comment } from '../Comment';
import { CommentRepository } from '../CommentRepository';
import { PaginatedResult } from '@/shared/domain/PaginatedResult';

export class GetProductCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(productId: string): Promise<Comment[]> {
    const result = await this.commentRepository.findByProductId(productId);
    return result.items;
  }
} 