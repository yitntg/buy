import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  isLoading?: boolean;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  color = 'blue',
  isLoading = false
}: DashboardCardProps) {
  // 颜色映射
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      borderColor: 'border-green-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      borderColor: 'border-red-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      borderColor: 'border-gray-200'
    }
  };
  
  const colors = colorMap[color];
  
  // 加载中状态
  if (isLoading) {
    return (
      <div className={`rounded-lg border ${colors.borderColor} p-6 ${colors.bg}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg border ${colors.borderColor} p-6 ${colors.bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className={`text-2xl font-semibold ${colors.text}`}>{value}</p>
            
            {trend && (
              <p className={`ml-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className={`${colors.iconBg} p-3 rounded-full`}>
            <div className={colors.iconText}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 预定义卡片变体
export function OrdersCard({ 
  value, 
  trend, 
  description,
  isLoading = false 
}: Omit<DashboardCardProps, 'title' | 'icon' | 'color'>) {
  const orderIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
  
  return (
    <DashboardCard
      title="订单总数"
      value={value}
      description={description}
      icon={orderIcon}
      trend={trend}
      color="blue"
      isLoading={isLoading}
    />
  );
}

export function RevenueCard({ 
  value, 
  trend, 
  description,
  isLoading = false 
}: Omit<DashboardCardProps, 'title' | 'icon' | 'color'>) {
  const revenueIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  return (
    <DashboardCard
      title="收入"
      value={value}
      description={description}
      icon={revenueIcon}
      trend={trend}
      color="green"
      isLoading={isLoading}
    />
  );
}

export function UsersCard({ 
  value, 
  trend, 
  description,
  isLoading = false 
}: Omit<DashboardCardProps, 'title' | 'icon' | 'color'>) {
  const usersIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  
  return (
    <DashboardCard
      title="用户数"
      value={value}
      description={description}
      icon={usersIcon}
      trend={trend}
      color="purple"
      isLoading={isLoading}
    />
  );
}

export function ProductsCard({ 
  value, 
  trend, 
  description,
  isLoading = false 
}: Omit<DashboardCardProps, 'title' | 'icon' | 'color'>) {
  const productsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
  
  return (
    <DashboardCard
      title="产品数"
      value={value}
      description={description}
      icon={productsIcon}
      trend={trend}
      color="yellow"
      isLoading={isLoading}
    />
  );
}
