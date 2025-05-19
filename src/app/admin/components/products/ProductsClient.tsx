'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/app/(shared)/types/product'
import { productService } from '../../services/productService'
import ProductsTable from './ProductsTable'

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts()
        setProducts(data)
      } catch (error) {
        console.error('获取产品列表失败:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await productService.updateProductStatus(id, status)
      setProducts(products.map(p => 
        p.id === id ? { ...p, status } : p
      ))
    } catch (error) {
      console.error('更新产品状态失败:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('删除产品失败:', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">产品管理</h1>
      </div>
      
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  )
} 