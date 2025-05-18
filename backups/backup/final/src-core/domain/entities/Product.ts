import { Money } from '../value-objects/Money';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: Money;
  images: string[];
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  public static create(props: ProductProps): Product {
    return new Product(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get price(): Money {
    return this.props.price;
  }

  public get images(): string[] {
    return [...this.props.images];
  }

  public get categoryId(): string {
    return this.props.categoryId;
  }

  public get stock(): number {
    return this.props.stock;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt ? new Date(this.props.updatedAt) : undefined;
  }

  public updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.props.stock = quantity;
  }

  public hasStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  public update(props: Partial<ProductProps>): void {
    Object.assign(this.props, {
      ...props,
      updatedAt: new Date()
    });
  }
} 