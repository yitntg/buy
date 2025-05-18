import { Order } from '../entities/Order';
import { Money } from '../value-objects/Money';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: Money;
  timestamp: Date;
}

export class PaymentService {
  public static validatePayment(order: Order, amount: Money): void {
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 'pending') {
      throw new Error('订单状态不正确');
    }

    if (!amount.equals(order.total)) {
      throw new Error('支付金额不正确');
    }
  }

  public static async processPayment(order: Order, paymentMethod: string): Promise<PaymentResult> {
    this.validatePayment(order, order.total);

    // 这里应该调用具体的支付服务实现
    // 为了演示，我们模拟一个成功的支付
    return {
      success: true,
      transactionId: crypto.randomUUID(),
      amount: order.total,
      timestamp: new Date()
    };
  }

  public static async refundPayment(order: Order, amount: Money): Promise<PaymentResult> {
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 'paid') {
      throw new Error('订单状态不正确');
    }

    if (amount.getAmount() > order.total.getAmount()) {
      throw new Error('退款金额不能大于订单金额');
    }

    // 这里应该调用具体的退款服务实现
    // 为了演示，我们模拟一个成功的退款
    return {
      success: true,
      transactionId: crypto.randomUUID(),
      amount,
      timestamp: new Date()
    };
  }
} 