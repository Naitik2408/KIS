'use client'

import { Product } from '@/lib/products'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

interface RelatedProductsProps {
  currentProduct: Product
  allProducts: Product[]
}

export function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.categories.some((category) => currentProduct.categories.includes(category)) ||
          p.tags?.some((tag) => currentProduct.tags?.includes(tag)))
    )
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border pt-12">
      <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  )
}
