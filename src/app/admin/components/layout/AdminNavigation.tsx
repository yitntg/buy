'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
  { name: '商品管理', href: '/admin/products', icon: '📦' },
  { name: '订单管理', href: '/admin/orders', icon: '🛒' },
  { name: '用户管理', href: '/admin/users', icon: '👥' },
  { name: '系统设置', href: '/admin/settings', icon: '⚙️' }
]

export default function AdminNavigation() {
  const pathname = usePathname()
  
  return (
    <nav className="flex space-x-4 mb-6">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
} 