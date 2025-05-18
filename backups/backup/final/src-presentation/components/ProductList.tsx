import React, { useEffect, useState } from 'react';
import { ProductViewModel } from '../view-models/ProductViewModel';
import { Container } from '../../infrastructure/container';
import { GetProductsUseCase } from '../../core/application/use-cases/GetProducts';
import { Product } from '../../core/domain/entities/Product';

interface ProductListProps {
  viewModel: ProductViewModel;
}

export const ProductList: React.FC<ProductListProps> = ({ viewModel }) => {
  const container = Container.getInstance();
  const getProductsUseCase = container.getUseCase<GetProductsUseCase>('GetProductsUseCase');
  const [state, setState] = useState(viewModel.getCurrentState());

  useEffect(() => {
    const subscription = viewModel.getState().subscribe(setState);
    return () => subscription.unsubscribe();
  }, [viewModel]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        viewModel.setLoading(true);
        const products = await getProductsUseCase.execute();
        viewModel.setProducts(products);
      } catch (error) {
        viewModel.setError(error instanceof Error ? error.message : '加载产品失败');
      }
    };

    loadProducts();
  }, [viewModel, getProductsUseCase]);

  if (state.loading) {
    return <div>加载中...</div>;
  }

  if (state.error) {
    return <div>错误: {state.error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.products.map((product: Product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold">¥{product.price}</span>
            <button
              onClick={() => viewModel.setSelectedProduct(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              查看详情
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 