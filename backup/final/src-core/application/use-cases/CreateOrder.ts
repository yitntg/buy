import { Order, OrderItem } from '../../domain/entities/Order';
import { Cart } from '../../domain/entities/Cart';
import { OrderRepository } from '../interfaces/OrderRepository';
import { CartRepository } from '../interfaces/CartRepository';
import { Money } from '../../domain/value-objects/Money';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository
  ) {}

  async execute(userId: string): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const orderItems = cart.items.map(item => 
      OrderItem.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })
    );

    const order = Order.create({
      id: crypto.randomUUID(),
      userId,
      items: orderItems,
      status: 'pending',
      total: cart.total,
      createdAt: new Date()
    });

    await this.orderRepository.save(order);
    await this.cartRepository.delete(cart.id);

    return order;
  }
} 