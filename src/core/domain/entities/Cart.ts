import { Money } from '../value-objects/Money';
import { Product } from './Product';

export interface CartItemProps {
  product: Product;
  quantity: number;
}

export class CartItem {
  private constructor(private readonly props: CartItemProps) {}

  public static create(props: CartItemProps): CartItem {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (!props.product.hasStock(props.quantity)) {
      throw new Error('Not enough stock');
    }
    return new CartItem(props);
  }

  public get product(): Product {
    return this.props.product;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get total(): Money {
    return this.product.price.multiply(this.quantity);
  }

  public updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (!this.product.hasStock(quantity)) {
      throw new Error('Not enough stock');
    }
    this.props.quantity = quantity;
  }
}

export interface CartProps {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Cart {
  private constructor(private readonly props: CartProps) {}

  public static create(props: CartProps): Cart {
    return new Cart(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get items(): CartItem[] {
    return [...this.props.items];
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  public get total(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.total),
      Money.create(0)
    );
  }

  public addItem(product: Product, quantity: number): void {
    const existingItem = this.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + quantity);
    } else {
      this.props.items.push(CartItem.create({ product, quantity }));
    }

    this.props.updatedAt = new Date();
  }

  public removeItem(productId: string): void {
    this.props.items = this.items.filter(
      item => item.product.id !== productId
    );
    this.props.updatedAt = new Date();
  }

  public updateItemQuantity(productId: string, quantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      item.updateQuantity(quantity);
      this.props.updatedAt = new Date();
    }
  }

  public clear(): void {
    this.props.items = [];
    this.props.updatedAt = new Date();
  }
} 