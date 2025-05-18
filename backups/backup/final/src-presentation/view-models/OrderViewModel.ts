import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../core/domain/entities/Order';

export interface OrderState {
  loading: boolean;
  orders: Order[];
  error: string | null;
}

export class OrderViewModel {
  private readonly state = new BehaviorSubject<OrderState>({
    loading: false,
    orders: [],
    error: null
  });

  public getState(): Observable<OrderState> {
    return this.state.asObservable();
  }

  public setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  public setOrders(orders: Order[]): void {
    this.state.next({
      loading: false,
      orders,
      error: null
    });
  }

  public setError(error: string): void {
    this.state.next({
      loading: false,
      orders: [],
      error
    });
  }

  public addOrder(order: Order): void {
    this.state.next({
      ...this.state.value,
      orders: [...this.state.value.orders, order]
    });
  }

  public updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.state.value.orders.map(order => {
      if (order.id === orderId) {
        order.updateStatus(status);
      }
      return order;
    });

    this.state.next({
      ...this.state.value,
      orders
    });
  }
} 