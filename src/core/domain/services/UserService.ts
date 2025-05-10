import { User } from '../entities/User';
import { Order } from '../entities/Order';

export class UserService {
  public static validateUserOrderAccess(user: User, order: Order): void {
    if (!user) {
      throw new Error('用户未登录');
    }

    if (user.id !== order.userId) {
      throw new Error('无权访问此订单');
    }
  }

  public static canCancelOrder(user: User, order: Order): boolean {
    this.validateUserOrderAccess(user, order);
    return order.canBeCancelled();
  }

  public static async cancelOrder(user: User, order: Order): Promise<void> {
    if (!this.canCancelOrder(user, order)) {
      throw new Error('无法取消此订单');
    }

    order.cancel();
  }

  public static validateUserCartAccess(user: User, cart: any): void {
    if (!user) {
      throw new Error('用户未登录');
    }

    if (user.id !== cart.userId) {
      throw new Error('无权访问此购物车');
    }
  }
} 