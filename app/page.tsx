import { Suspense } from 'react'
import HeroBanner from './components/HeroBanner'
import CategorySection from './components/CategorySection'
import FeaturedProducts from './components/FeaturedProducts'
import FeatureSection from './components/FeatureSection'
import { getFeaturedProducts, getCategories } from './services/productService'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1小时重新验证

export default async function Home() {
  // 从数据库获取数据
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ])

  return (
    <>
      <HeroBanner />
      
      <Suspense fallback={<div className="py-12 text-center">加载分类中...</div>}>
        <CategorySection categories={categories} />
      </Suspense>
      
      <Suspense fallback={<div className="py-12 text-center">加载热门商品中...</div>}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
      
      <FeatureSection />
    </>
  )
} 