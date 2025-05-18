import { CommentRepository } from '../CommentRepository';

export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(id: string): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new Error('评论不存在');
    }

    await this.commentRepository.delete(id);
  }
} 