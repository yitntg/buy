export class CommentContent {
  private constructor(private readonly value: string) {}

  static create(content: string): CommentContent {
    if (!content || !content.trim()) {
      throw new Error('评论内容不能为空');
    }

    if (content.length > 1000) {
      throw new Error('评论内容不能超过1000个字符');
    }

    return new CommentContent(content.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CommentContent): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
} 