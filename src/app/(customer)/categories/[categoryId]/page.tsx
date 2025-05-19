import CategoryClient from '../../components/CategoryClient'

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryClient categoryId={params.categoryId} />
} 