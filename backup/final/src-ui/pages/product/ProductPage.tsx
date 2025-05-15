import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useObservable } from 'rxjs-hooks';
import { ProductController } from '../../../presentation/controllers/ProductController';
import { ProductViewModel } from '../../../presentation/view-models/ProductViewModel';
import { ProductCard } from '../../components/organisms/ProductCard';

interface ProductPageProps {
  controller: ProductController;
  viewModel: ProductViewModel;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  controller,
  viewModel
}) => {
  const { id } = useParams();
  const state = useObservable(() => viewModel.getState());

  useEffect(() => {
    if (id) {
      controller.loadProduct(id as string);
    }
  }, [id, controller]);

  if (state?.loading) {
    return <div>Loading...</div>;
  }

  if (state?.error) {
    return <div>Error: {state.error}</div>;
  }

  if (!state?.product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductCard
        product={state.product}
        onAddToCart={(product) => {
          // 处理添加到购物车的逻辑
          console.log('Add to cart:', product);
        }}
      />
    </div>
  );
}; 