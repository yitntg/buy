import { Product } from '@/app/(shared)/types/product'

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟数据
let products: Product[] = [
  {
    id: '1',
    name: '商品1',
    price: 99.99,
    stock: 100,
    category: '分类1',
    status: 'active',
    image: '/images/product1.jpg',
    description: '这是一个示例商品描述'
  },
  {
    id: '2',
    name: '商品2',
    price: 199.99,
    stock: 50,
    category: '分类2',
    status: 'inactive',
    image: '/images/product2.jpg',
    description: '这是另一个示例商品描述'
  }
]

export const productService = {
  // 获取商品列表
  async getProducts(): Promise<Product[]> {
    await delay(1000)
    return products
  },
  
  // 获取单个商品
  async getProduct(id: string): Promise<Product | null> {
    await delay(500)
    return products.find(p => p.id === id) || null
  },
  
  // 创建商品
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(1000)
    const newProduct = {
      ...product,
      id: Date.now().toString()
    }
    products.push(newProduct)
    return newProduct
  },
  
  // 更新商品
  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    await delay(1000)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...product
    }
    return products[index]
  },
  
  // 删除商品
  async deleteProduct(id: string): Promise<boolean> {
    await delay(500)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    products.splice(index, 1)
    return true
  },
  
  // 更新商品状态
  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<Product | null> {
    await delay(500)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    products[index].status = status
    return products[index]
  }
} 