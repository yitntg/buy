import { Money } from '../value-objects/Money';
import { Product } from './Product';

export interface OrderItemProps {
  product: Product;
  quantity: number;
  price: Money;
}

export class OrderItem {
  private constructor(private readonly props: OrderItemProps) {}

  public static create(props: OrderItemProps): OrderItem {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    return new OrderItem(props);
  }

  public get product(): Product {
    return this.props.product;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get price(): Money {
    return this.props.price;
  }

  public get total(): Money {
    return this.price.multiply(this.quantity);
  }
}

export interface OrderProps {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: Money;
  createdAt: Date;
}

export class Order {
  private constructor(private readonly props: OrderProps) {}

  public static create(props: OrderProps): Order {
    return new Order(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get items(): OrderItem[] {
    return [...this.props.items];
  }

  public get status(): 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' {
    return this.props.status;
  }

  public get total(): Money {
    return this.props.total;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public updateStatus(status: OrderProps['status']): void {
    this.props.status = status;
  }

  public canBeCancelled(): boolean {
    return ['pending', 'paid'].includes(this.status);
  }

  public cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('Order cannot be cancelled');
    }
    this.updateStatus('cancelled');
  }
} 