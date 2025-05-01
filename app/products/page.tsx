import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

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
  specifications?: Record<string, string | number>
}

// 模拟获取商品数据的函数
async function getProducts(): Promise<Product[]> {
  // 在实际应用中，这里应该调用API获取数据，并且可以包含查询参数
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, { cache: 'no-store' })
  
  if (!res.ok) {
    throw new Error('获取商品列表失败')
  }
  
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  // 分类数据
  const categories = [
    { id: 1, name: '电子产品' },
    { id: 2, name: '家居用品' },
    { id: 3, name: '服装鞋帽' },
    { id: 4, name: '美妆护肤' },
    { id: 5, name: '食品饮料' },
    { id: 6, name: '运动户外' }
  ]
  
  // 价格区间
  const priceRanges = [
    { id: 1, name: '¥0 - ¥100' },
    { id: 2, name: '¥100 - ¥300' },
    { id: 3, name: '¥300 - ¥500' },
    { id: 4, name: '¥500 - ¥1000' },
    { id: 5, name: '¥1000以上' }
  ]
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">全部商品</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 筛选侧边栏 */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">筛选条件</h2>
              
              {/* 分类筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">商品分类</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`category-${category.id}`}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 价格筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">价格区间</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <div key={range.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`price-${range.id}`}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`price-${range.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 评分筛选 */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">商品评分</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`rating-${rating}`}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <label 
                        htmlFor={`rating-${rating}`}
                        className="ml-2 text-sm text-gray-700 flex items-center"
                      >
                        {rating}星及以上
                        <span className="ml-1 text-yellow-400">{'★'.repeat(rating)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600">
                应用筛选
              </button>
            </div>
            
            {/* 商品列表 */}
            <div className="flex-1">
              {/* 排序选项 */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  共找到 <span className="text-primary font-medium">{products.length}</span> 件商品
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">排序：</span>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="recommend">推荐</option>
                    <option value="newest">最新</option>
                    <option value="price-asc">价格由低到高</option>
                    <option value="price-desc">价格由高到低</option>
                    <option value="sales">销量</option>
                  </select>
                </div>
              </div>
              
              {/* 商品网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* 分页 */}
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <a href="#" className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
                    上一页
                  </a>
                  <a href="#" className="px-3 py-1 rounded bg-primary text-white">
                    1
                  </a>
                  <a href="#" className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    2
                  </a>
                  <a href="#" className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    3
                  </a>
                  <span className="px-3 py-1 text-gray-500">...</span>
                  <a href="#" className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    10
                  </a>
                  <a href="#" className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50">
                    下一页
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 