'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  disabled = false 
}: PaginationProps) {
  // 生成分页按钮数组
  const generatePaginationItems = () => {
    // 最多显示7个分页按钮
    const items: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // 总页数少于7，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // 总页数超过7，显示部分页码和省略号
      items.push(1); // 始终显示第一页
      
      if (currentPage <= 3) {
        // 当前页靠近开始位置
        items.push(2, 3, 4, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页靠近结束位置
        items.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // 当前页在中间位置
        items.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return items;
  };
  
  const paginationItems = generatePaginationItems();
  
  // 处理上一页
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };
  
  // 处理下一页
  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };
  
  // 处理页码点击
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && !disabled) {
      onPageChange(page);
    }
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      {/* 上一页按钮 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || disabled}
        className={`px-3 py-1 rounded border ${
          currentPage === 1 || disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="上一页"
      >
        上一页
      </button>
      
      {/* 页码按钮 */}
      {paginationItems.map((item, index) => (
        <button
          key={index}
          onClick={() => typeof item === 'number' && handlePageClick(item)}
          disabled={item === '...' || item === currentPage || disabled}
          className={`w-9 h-9 flex items-center justify-center rounded ${
            item === currentPage
              ? 'bg-blue-600 text-white'
              : item === '...'
                ? 'text-gray-400 cursor-default'
                : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {item}
        </button>
      ))}
      
      {/* 下一页按钮 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || disabled}
        className={`px-3 py-1 rounded border ${
          currentPage === totalPages || disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="下一页"
      >
        下一页
      </button>
    </div>
  );
} 
