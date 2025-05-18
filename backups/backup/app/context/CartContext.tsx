'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 购物车商品类型
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 购物车上下文类型
interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  totalPrice: number;
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 从本地存储加载购物车
  useEffect(() => {
    if (isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);
  
  // 保存购物车到本地存储
  useEffect(() => {
    if (isBrowser && isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);
  
  // 添加商品到购物车
  const addItem = (product: any, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 如果商品已存在，更新数量
        return prevItems.map(item => 
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 如果商品不存在，添加新商品
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        }];
      }
    });
  };
  
  // 从购物车移除商品
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // 更新商品数量
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  // 清空购物车
  const clearCart = () => {
    setItems([]);
  };
  
  // 计算商品总数
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // 计算总价
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // 提供上下文值
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemsCount,
    totalPrice
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 自定义hook来使用购物车上下文
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 