import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../interfaces/OrderRepository';

export class GetUserOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
} 