import React from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function UploadProduct() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">上传商品</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>

            <form className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h2 className="text-xl font-medium mb-4">基本信息</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      商品名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      商品分类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">选择分类</option>
                      <option value="1">电子产品</option>
                      <option value="2">家居用品</option>
                      <option value="3">服装鞋帽</option>
                      <option value="4">美妆护肤</option>
                      <option value="5">食品饮料</option>
                      <option value="6">运动户外</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      商品价格 (¥) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                      库存数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* 商品描述 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              {/* 商品规格 */}
              <div>
                <h2 className="text-xl font-medium mb-4">商品规格</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      品牌
                    </label>
                    <input
                      type="text"
                      id="brand"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      型号
                    </label>
                    <input
                      type="text"
                      id="model"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
                      规格参数
                    </label>
                    <textarea
                      id="specifications"
                      rows={3}
                      placeholder="例如：尺寸、重量、材质、颜色等"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 图片上传 */}
              <div>
                <h2 className="text-xl font-medium mb-4">商品图片</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-2">
                    <div className="text-4xl text-gray-400">📸</div>
                    <p className="text-gray-500">点击上传或拖拽图片至此处</p>
                    <p className="text-xs text-gray-400">支持 JPG, PNG 格式，最多可上传 5 张图片</p>
                    <input
                      type="file"
                      id="images"
                      accept="image/jpeg, image/png"
                      multiple
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-4 py-2 border border-primary text-primary rounded-full hover:bg-blue-50 focus:outline-none"
                    >
                      选择图片
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {/* 此处会显示上传的图片预览 */}
                </div>
              </div>

              {/* 配送与售后 */}
              <div>
                <h2 className="text-xl font-medium mb-4">配送与售后</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="free_shipping"
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="free_shipping" className="ml-2 text-sm text-gray-700">
                      免运费
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="returnable"
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="returnable" className="ml-2 text-sm text-gray-700">
                      支持7天无理由退换
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="warranty"
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="warranty" className="ml-2 text-sm text-gray-700">
                      提供保修服务
                    </label>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  保存为草稿
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  上传商品
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 