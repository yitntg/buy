import Link from 'next/link'

// 定义分类类型接口
interface Category {
  id: number
  name: string
  icon: string
}

interface CategorySectionProps {
  categories: Category[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-12 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">热门分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              href={`/category/${category.id}`} 
              key={category.id} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 