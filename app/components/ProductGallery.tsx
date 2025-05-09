'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'

interface ProductGalleryProps {
  images: string[] // 多个图片URL
  productName: string // 用于alt文本
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  
  // 确保至少有一张图片
  const imageList = images && images.length > 0 ? images : ['/placeholder-product.jpg'] 
  
  // 处理轮播导航
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    )
  }
  
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    )
  }
  
  // 为键盘导航添加事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousImage()
      } else if (e.key === 'ArrowRight') {
        goToNextImage()
      } else if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])
  
  // 处理图片放大查看
  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }
  
  // 处理放大后的移动
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setZoomPosition({ x, y })
  }
  
  // 自动轮播
  useEffect(() => {
    if (isZoomed || imageList.length <= 1) return
    
    const interval = setInterval(goToNextImage, 5000)
    return () => clearInterval(interval)
  }, [isZoomed, imageList.length])
  
  return (
    <div className="w-full">
      {/* 主图展示区 */}
      <div 
        className={`relative rounded-lg overflow-hidden ${isZoomed ? 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4' : 'h-[400px] md:h-[500px] border'}`}
        onClick={isZoomed ? toggleZoom : undefined}
      >
        {/* 关闭放大查看的按钮 */}
        {isZoomed && (
          <button 
            className="absolute top-4 right-4 text-white z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(false)
            }}
          >
            <X size={24} />
          </button>
        )}
        
        {/* 当前显示的图片 */}
        <div 
          className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out max-h-[90vh] max-w-[90vw] w-auto h-auto' : 'cursor-pointer'}`}
          onClick={isZoomed ? undefined : toggleZoom}
          onMouseMove={handleMouseMove}
        >
          <Image 
            src={imageList[currentImageIndex]} 
            alt={`${productName} - 图片 ${currentImageIndex + 1}`}
            fill={!isZoomed}
            width={isZoomed ? 1200 : undefined}
            height={isZoomed ? 1200 : undefined}
            className={`object-contain ${isZoomed ? 'w-auto h-auto max-w-full max-h-full' : 'object-cover'}`}
            priority={currentImageIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={
              isZoomed 
                ? { 
                    transform: `scale(1.5) translate(${-zoomPosition.x + 50}%, ${-zoomPosition.y + 50}%)`,
                    transition: 'transform 0.1s ease-out'
                  } 
                : undefined
            }
          />
        </div>
        
        {/* 放大图标 */}
        {!isZoomed && (
          <button 
            className="absolute bottom-4 right-4 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleZoom()
            }}
          >
            <ZoomIn size={20} className="text-gray-700" />
          </button>
        )}
        
        {/* 导航按钮 - 只有多张图片时显示 */}
        {imageList.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                goToPreviousImage()
              }}
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                goToNextImage()
              }}
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>
      
      {/* 缩略图展示 - 只有多张图片时显示 */}
      {imageList.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4 overflow-x-auto py-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image 
                src={image} 
                alt={`${productName} - 缩略图 ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 