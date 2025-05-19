import ProductEditClient from './ProductEditClient'

export default function ProductEditPage({ params }: { params: { id: string } }) {
  return <ProductEditClient id={params.id} />
} 