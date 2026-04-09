'use client'

import { Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'
import { Empty } from '@/components/ui/empty'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-96 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No items available"
        description="Try another category or search term to find available laptops."
        size="lg"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group"
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  )
}
