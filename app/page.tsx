import Image from 'next/image'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductCard from './components/ProductCard'
import { supabase } from '@/lib/supabase'

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

// 定义分类类型接口
interface Category {
  id: number
  name: string
  icon: string
}

// 获取商品数据
async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) {
      console.error('获取商品失败:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('获取商品异常:', error)
    return []
  }
}

// 获取分类数据
async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('获取分类失败:', error)
      return []
    }

    // 为分类添加图标
    const categoriesWithIcons = data.map(category => ({
      ...category,
      icon: getCategoryIcon(category.id)
    }))

    return categoriesWithIcons || []
  } catch (error) {
    console.error('获取分类异常:', error)
    return []
  }
}

// 获取分类图标
function getCategoryIcon(categoryId: number): string {
  const icons: Record<number, string> = {
    1: '📱',
    2: '🏠',
    3: '👕',
    4: '💄',
    5: '🍎',
    6: '⚽'
  }
  return icons[categoryId] || '🔍'
}

export default async function Home() {
  // 从数据库获取数据
  const featuredProducts = await getProducts()
  const categories = await getCategories()

  return (
    <main className="min-h-screen">
      {/* 头部导航 */}
      <Header />

      {/* 主图banner */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-4xl font-bold mb-4">品质购物，品质生活</h2>
            <p className="text-lg text-gray-600 mb-6">
              发现各类优质商品，享受便捷购物体验
            </p>
            <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 inline-block">
              立即购物
            </Link>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-96 w-full">
            <Image
              src="https://picsum.photos/id/10/800/600"
              alt="Banner image"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* 商品分类 */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link href={`/category/${category.id}`} key={category.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 热门商品 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">热门商品</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">暂无商品数据，请先添加商品</p>
              <Link href="/upload" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600">
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

      {/* 网站特色 */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">我们的优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-primary">🚚</div>
              <h3 className="text-xl font-medium mb-2">快速配送</h3>
              <p className="text-gray-600">大部分地区24小时内发货，特定地区支持当日达</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-primary">💯</div>
              <h3 className="text-xl font-medium mb-2">品质保证</h3>
              <p className="text-gray-600">所有商品严格品质把关，7天无理由退换</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-primary">💬</div>
              <h3 className="text-xl font-medium mb-2">贴心服务</h3>
              <p className="text-gray-600">专业客服团队，提供7×24小时在线咨询服务</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <Footer />
    </main>
  )
} 