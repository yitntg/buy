'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/src/app/(shared)/types/product'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>('')

  useEffect(() => {
    if (images?.length) {
      // 默认显示主图或第一张图片
      const primaryImage = images.find(img => img.is_primary)
      setActiveImage(primaryImage?.image_url || images[0].image_url)
    }
  }, [images])

  // 如果没有图片，显示占位图
  if (!images?.length) {
    return (
      <div className="w-full aspect-square relative">
        <Image
          src="/images/placeholder.jpg"
          alt="商品图片未找到"
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="product-gallery">
      {/* 主图显示 */}
      <div className="main-image-container relative aspect-square mb-4">
        <Image
          src={activeImage || images[0].image_url}
          alt={productName}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
      
      {/* 缩略图列表 */}
      <div className="thumbnail-list grid grid-cols-5 gap-2">
        {images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(image => (
            <button
              key={image.id}
              onClick={() => setActiveImage(image.image_url)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all
                ${activeImage === image.image_url 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-transparent hover:border-gray-300'}`}
            >
              <Image
                src={image.image_url}
                alt={`${productName} - 图片 ${image.id}`}
                fill
                className="object-cover"
              />
              {image.is_primary && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-0.5 text-center">
                  主图
                </div>
              )}
            </button>
          ))}
      </div>
    </div>
  )
} 