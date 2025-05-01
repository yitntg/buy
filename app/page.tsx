import Image from 'next/image'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductCard from './components/ProductCard'

export default function Home() {
  // 模拟的热门商品数据
  const featuredProducts = [
    {
      id: 1,
      name: '高品质蓝牙耳机',
      description: '无线降噪耳机，长续航，高音质',
      price: 299,
      image: 'https://picsum.photos/id/1/400/300'
    },
    {
      id: 2,
      name: '智能手表',
      description: '全面健康监测，多功能运动模式',
      price: 599,
      image: 'https://picsum.photos/id/2/400/300'
    },
    {
      id: 3,
      name: '轻薄笔记本电脑',
      description: '高性能处理器，长达12小时续航',
      price: 4999,
      image: 'https://picsum.photos/id/3/400/300'
    },
    {
      id: 4,
      name: '专业摄影相机',
      description: '2400万像素，4K视频录制',
      price: 3299,
      image: 'https://picsum.photos/id/4/400/300'
    }
  ]

  const categories = [
    { id: 1, name: '电子产品', icon: '📱' },
    { id: 2, name: '家居用品', icon: '🏠' },
    { id: 3, name: '服装鞋帽', icon: '👕' },
    { id: 4, name: '美妆护肤', icon: '💄' },
    { id: 5, name: '食品饮料', icon: '🍎' },
    { id: 6, name: '运动户外', icon: '⚽' }
  ]

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
              <Link href="/" key={category.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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