import { Order, OrderItem } from '../entities/Order';
import { Cart } from '../entities/Cart';
import { User } from '../entities/User';
import { Money } from '../value-objects/Money';

export class OrderService {
  public static validateOrderCreation(cart: Cart, user: User): void {
    if (!cart || cart.items.length === 0) {
      throw new Error('购物车为空');
    }

    if (!user) {
      throw new Error('用户未登录');
    }

    // 检查库存
    for (const item of cart.items) {
      if (!item.product.hasStock(item.quantity)) {
        throw new Error(`商品 ${item.product.name} 库存不足`);
      }
    }
  }

  public static calculateOrderTotal(cart: Cart): Money {
    return cart.total;
  }

  public static createOrderFromCart(cart: Cart, user: User): Order {
    this.validateOrderCreation(cart, user);
    const total = this.calculateOrderTotal(cart);

    const orderItems = cart.items.map(item => 
      OrderItem.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })
    );

    return Order.create({
      id: crypto.randomUUID(),
      userId: user.id,
      items: orderItems,
      status: 'pending',
      total,
      createdAt: new Date()
    });
  }
} 