'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  // 导航链接配置
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品' },
    { href: '/categories', label: '商品分类' },
    { href: '/about', label: '关于我们' },
    { href: '/contact', label: '联系我们' },
  ];
  
  return (
    <nav className="hidden md:flex space-x-8">
      {navLinks.map(link => {
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-blue-600 transition-colors ${
              isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
} 
