import { User } from './auth';
import { Product } from './product';

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// 订单项
export interface OrderItem {
  id?: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  created_at?: string;
  order_id?: string;
}

// 订单
export interface Order {
  id: string;
  user_id: string;
  user?: User;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
  payment_intent_id?: string;
  shipping_address_id?: string;
  shipping_address?: ShippingAddress;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
}

// 收货地址
export interface ShippingAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

// 支付相关类型
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'failed';
  client_secret: string;
  created_at?: string;
  order_id?: string;
}

// 创建订单请求
export interface CreateOrderRequest {
  items: {
    product_id: string;
    quantity: number;
  }[];
  shipping_address_id: string;
}

// 订单摘要，用于列表展示
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  item_count: number;
  tracking_number?: string;
}

// 订单历史记录
export interface OrderHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  timestamp: string;
  comment?: string;
  created_by?: string;
} 
