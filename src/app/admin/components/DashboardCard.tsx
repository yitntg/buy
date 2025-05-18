'use client'

import { ReactNode } from 'react';

// 趋势数据类型
interface TrendData {
  value: number;
  isPositive: boolean;
}

// 卡片基础属性
interface CardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: TrendData;
  description?: string;
  isLoading?: boolean;
}

// 基础卡片组件
const Card = ({ title, value, icon, trend, description, isLoading }: CardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-gray-400">{icon}</div>
          </div>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className={`text-sm flex items-center mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              {description && <span className="ml-1">{description}</span>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 订单卡片
export const OrdersCard = ({ value, trend, description, isLoading }: Omit<CardProps, 'title' | 'icon'>) => {
  return (
    <Card
      title="订单数"
      value={value}
      icon={<span className="text-xl">📦</span>}
      trend={trend}
      description={description}
      isLoading={isLoading}
    />
  );
};

// 营收卡片
export const RevenueCard = ({ value, trend, description, isLoading }: Omit<CardProps, 'title' | 'icon'>) => {
  return (
    <Card
      title="总营收"
      value={value}
      icon={<span className="text-xl">💰</span>}
      trend={trend}
      description={description}
      isLoading={isLoading}
    />
  );
};

// 用户卡片
export const UsersCard = ({ value, trend, description, isLoading }: Omit<CardProps, 'title' | 'icon'>) => {
  return (
    <Card
      title="用户数"
      value={value}
      icon={<span className="text-xl">👥</span>}
      trend={trend}
      description={description}
      isLoading={isLoading}
    />
  );
};

// 商品卡片
export const ProductsCard = ({ value, trend, description, isLoading }: Omit<CardProps, 'title' | 'icon'>) => {
  return (
    <Card
      title="商品数"
      value={value}
      icon={<span className="text-xl">🛍️</span>}
      trend={trend}
      description={description}
      isLoading={isLoading}
    />
  );
};
