'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatINR = (value: number | string) => {
    const parsed =
      typeof value === 'number'
        ? value
        : parseFloat(String(value).replace(/[₹$,]/g, '')) || 0

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(parsed)
  }

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative">
      {/* Card Container */}
      <div
        className="bg-card rounded-2xl overflow-hidden border border-border/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted aspect-4/3">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-transparent" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
              {product.badge}
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
              -{discountPercent}%
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute bottom-3 right-3 p-2 bg-background/85 rounded-full shadow-md backdrop-blur transition-all hover:scale-105"
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
              }`}
            />
          </button>

          {/* Quick Add Button */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-5">
                <ShoppingCart className="w-4 h-4" />
                Quick View
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Category */}
          <div className="mb-2 flex flex-wrap gap-1.5">
            {product.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-snug group-hover:text-primary transition">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs (for laptops and featured products) */}
          {product.specs && (product.categories.includes('Laptops') || product.featured) && (
            <div className="mb-5 pb-5 border-b border-border">
              <div className="grid grid-cols-1 gap-2 text-xs">
                {Object.entries(product.specs as Record<string, string>).slice(0, 2).map(([key, value]: [string, string]) => (
                  <div key={key} className="flex items-center justify-between rounded-sm bg-muted/60 px-2.5 py-1.5">
                    <span className="text-muted-foreground font-medium">{key}</span>
                    <span className="text-foreground font-semibold text-right line-clamp-1 ml-3">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3 mb-5">
            <span className="text-xl sm:text-2xl font-bold text-foreground leading-none">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through leading-none">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => router.push(`/products/${product.id}`)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium"
          >
            View Details
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
