import { OrderRepository } from '../interfaces/OrderRepository';

export interface UpdateOrderStatusCommand {
  orderId: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: UpdateOrderStatusCommand): Promise<void> {
    const { orderId, status } = command;
    
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`订单 ${orderId} 不存在`);
    }

    // 验证状态转换是否有效
    if (!this.isValidStatusTransition(order.status, status)) {
      throw new Error(`不允许从 ${order.status} 状态转换为 ${status}`);
    }

    // 更新订单状态
    await this.orderRepository.updateStatus(orderId, status);
  }

  private isValidStatusTransition(currentStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled', 
                                newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'): boolean {
    // 定义允许的状态转换
    const allowedTransitions: Record<string, Array<'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'>> = {
      'pending': ['paid', 'cancelled'],
      'paid': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': ['cancelled'],
      'cancelled': []
    };

    // 检查当前状态是否允许转换为新状态
    const allowed = allowedTransitions[currentStatus] || [];
    return allowed.includes(newStatus);
  }
} 