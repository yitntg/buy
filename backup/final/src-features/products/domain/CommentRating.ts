export class CommentRating {
  private constructor(private readonly value: number) {}

  static create(rating: number): CommentRating {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1-5之间');
    }

    return new CommentRating(rating);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: CommentRating): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }

  static calculateAverage(ratings: CommentRating[]): number {
    if (ratings.length === 0) {
      return 0;
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.getValue(), 0);
    return Number((sum / ratings.length).toFixed(1));
  }
} 