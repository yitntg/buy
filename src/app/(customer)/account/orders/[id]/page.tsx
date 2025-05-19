'use client'

import OrderDetailClient from '../../components/OrderDetailClient'

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  return <OrderDetailClient orderId={params.id} />
} 