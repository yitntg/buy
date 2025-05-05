export type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
  created_at?: string
  brand?: string
  model?: string
  specifications?: string
  free_shipping?: boolean
  returnable?: boolean
  warranty?: boolean
} 