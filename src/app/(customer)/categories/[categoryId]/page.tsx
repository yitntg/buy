import Link from 'next/link'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/src/app/(shared)/infrastructure/supabase/server'
import ProductCard from '@/src/app/(shared)/components/ProductCard'
import LoadingSkeleton from '@/src/app/(shared)/components/LoadingSkeleton'
import ProductFilters from '@/src/app/(shared)/components/ProductFilters'
import ProductSorter from '@/src/app/(shared)/components/ProductSorter'
import { clientPageConfig } from '@/src/app/config'

// 使用客户端配置
export const dynamic = clientPageConfig.dynamic
export const fetchCache = clientPageConfig.fetchCache
export const revalidate = clientPageConfig.revalidate

// 分类名称映射 - 后续可从数据库获取
const categoryNames: { [key: string]: string } = {
  '1': '电子产品',
  '2': '家居用品',
  '3': '服装鞋帽',
  '4': '美妆护肤',
  '5': '食品饮料',
  '6': '运动户外'
}

// 动态生成元数据
export async function generateMetadata({ 
  params,
  searchParams
}: { 
  params: { categoryId: string },
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const categoryName = categoryNames[params.categoryId] || '商品分类'
  
  // 添加价格范围到元数据描述
  let description = `浏览${categoryName}的全部商品 - 乐购商城提供优质${categoryName}，种类丰富，价格实惠。`;
  const minPrice = searchParams['min_price'];
  const maxPrice = searchParams['max_price'];
  
  if (minPrice || maxPrice) {
    description += ' 价格范围:';
    if (minPrice) description += ` ¥${minPrice}起`;
    if (minPrice && maxPrice) description += ' 至';
    if (maxPrice) description += ` ¥${maxPrice}`;
  }
  
  return {
    title: `${categoryName} - 乐购商城`,
    description,
    // 添加结构化数据
    openGraph: {
      title: `${categoryName} - 乐购商城`,
      description,
      type: 'website',
    }
  }
}

// 产品接口
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

// 产品列表组件
function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-medium mb-2">暂无相关商品</h2>
        <p className="text-gray-500 mb-4">我们正在积极丰富该分类的商品</p>
        <Link href="/" className="text-primary hover:underline">
          返回首页浏览其他商品
        </Link>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// 页面骨架屏
function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="w-full h-52 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 类别页面
export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: { categoryId: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryId = params.categoryId
  const categoryName = categoryNames[categoryId] || '未知分类'
  
  // 解析筛选参数
  const minPrice = typeof searchParams.min_price === 'string' ? parseInt(searchParams.min_price) : undefined;
  const maxPrice = typeof searchParams.max_price === 'string' ? parseInt(searchParams.max_price) : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  
  // 从数据库获取分类商品数据
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', parseInt(categoryId))
    
  // 添加价格过滤
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }
  
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
  }
  
  // 添加排序
  switch(sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }
  
  // 限制获取的数量
  query = query.limit(20)
  
  const { data: products, error } = await query
  
  // 处理错误情况
  if (error) {
    console.error('获取分类商品失败:', error)
    // 可以返回自定义错误页面或抛出错误
  }
  
  // 获取价格范围用于过滤器
  const { data: priceRange } = await supabase
    .from('products')
    .select('price')
    .eq('category', parseInt(categoryId))
    .order('price', { ascending: true })
    .limit(1)
    .single()
    
  const { data: maxPriceRange } = await supabase
    .from('products')
    .select('price')
    .eq('category', parseInt(categoryId))
    .order('price', { ascending: false })
    .limit(1)
    .single()
    
  const lowestPrice = priceRange?.price || 0
  const highestPrice = maxPriceRange?.price || 5000
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* 面包屑 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{categoryName}</h1>
            <Link href="/" className="text-primary hover:underline">
              返回首页
            </Link>
          </div>
          <div className="mt-2 text-gray-500">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">›</span>
            <span>{categoryName}</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧筛选栏 */}
          <div className="w-full md:w-64 shrink-0">
            <ProductFilters 
              categoryId={categoryId} 
              minPrice={minPrice}
              maxPrice={maxPrice}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              currentSort={sort}
            />
          </div>
          
          {/* 商品主内容区 */}
          <div className="flex-1">
            {/* 排序工具栏 */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap justify-between items-center">
                <span className="text-gray-500">
                  找到 <span className="font-medium text-gray-700">{products?.length || 0}</span> 个商品
                </span>
                <ProductSorter currentSort={sort} categoryId={categoryId} />
              </div>
            </div>
            
            {/* 商品列表 */}
            <Suspense fallback={<CategorySkeleton />}>
              <ProductList products={products || []} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
} 