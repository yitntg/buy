// 用户相关类型
export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
  created_at?: string;
}

// 产品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  stock: number;
  created_at: string;
}

// 订单相关类型
export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

// 支付相关类型
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'failed';
  client_secret: string;
}

// 认证相关类型
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} 