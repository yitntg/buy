import Link from 'next/link'
import ProductCard from './ProductCard'

// 定义商品类型接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
}

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">热门商品</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">暂无商品数据，请先添加商品</p>
            <Link href="/admin/products/new" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600">
              添加商品
            </Link>
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/products" className="text-primary font-medium hover:underline">
            查看更多商品 →
          </Link>
        </div>
      </div>
    </section>
  )
} 