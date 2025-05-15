import React, { useEffect } from 'react';
import { OrderViewModel } from '../view-models/OrderViewModel';
import { Container } from '../../infrastructure/container';
import { GetUserOrdersUseCase } from '../../core/application/use-cases/GetUserOrders';

interface OrderListProps {
  viewModel: OrderViewModel;
  userId: string;
}

export const OrderList: React.FC<OrderListProps> = ({ viewModel, userId }) => {
  const container = Container.getInstance();
  const getUserOrdersUseCase = container.getUseCase<GetUserOrdersUseCase>('GetUserOrdersUseCase');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        viewModel.setLoading(true);
        const orders = await getUserOrdersUseCase.execute(userId);
        viewModel.setOrders(orders);
      } catch (error) {
        viewModel.setError(error instanceof Error ? error.message : '加载订单失败');
      }
    };

    loadOrders();
  }, [viewModel, getUserOrdersUseCase, userId]);

  const { loading, orders, error } = viewModel.getState();

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>暂无订单</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">订单号: {order.id}</h3>
            <span className={`px-3 py-1 rounded ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status === 'pending' ? '待处理' :
               order.status === 'processing' ? '处理中' :
               order.status === 'completed' ? '已完成' :
               '已取消'}
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-gray-600">¥{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <span className="text-lg font-bold">总计: ¥{order.total}</span>
            <span className="text-gray-600">
              下单时间: {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 