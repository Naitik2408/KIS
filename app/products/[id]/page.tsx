'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import type { Product } from '@/lib/products'
import Navigation from '@/components/navigation'
import { ProductGallery } from '@/components/product-gallery'
import { SearchModal } from '@/components/search-modal'
import { CartSidebar } from '@/components/cart-sidebar'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCircle2, Package, Shield } from 'lucide-react'
import Link from 'next/link'
import { addToCart } from '@/lib/cart'

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      const id = params.id as string

      try {
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' })
        if (!res.ok) {
          setProduct(null)
          return
        }

        const data = (await res.json()) as { product: Product }
        setProduct(data.product)
      } catch (error) {
        console.error('[product-detail] Failed loading product', error)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation onCartOpen={() => setCartOpen(true)} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">{isLoading ? 'Loading product...' : 'Product not found'}</p>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, 1)

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    setCartOpen(true)
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const specsEntries = Object.entries(product.specs || {})

  const quickHighlightKeys = [
    'Processor',
    'RAM',
    'Storage',
    'Display',
    'Graphics',
    'Keyboard',
    'Operating System',
  ]

  const quickHighlights = specsEntries.filter(([key]) => quickHighlightKeys.includes(key)).slice(0, 7)

  const conditionText = (product.specs?.Condition as string | undefined) || null
  const inTheBoxText = (product.specs?.['In The Box'] as string | undefined) || null
  const osText = (product.specs?.['Operating System'] as string | undefined) || null

  const quantityEntry = specsEntries.find(([key]) => {
    const normalized = key.toLowerCase()
    return normalized.includes('qty') || normalized.includes('quantity')
  })

  return (
    <main className="min-h-screen bg-background">
      <Navigation onCartOpen={() => setCartOpen(true)} />

      {/* Breadcrumb */}
      <div className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <a href="/products" className="hover:text-foreground transition">Products</a>
            <span>/</span>
            {product.categories[0] ? (
              <a href={`/products?category=${encodeURIComponent(product.categories[0])}`} className="hover:text-foreground transition">
                {product.categories[0]}
              </a>
            ) : (
              <span>Uncategorized</span>
            )}
            <span>/</span>
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Product Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6 mb-10 sm:mb-12">
          {/* Product Gallery - Left Column */}
          <div className="lg:col-span-2">
            <ProductGallery 
              images={product.images || [product.image]} 
              mainImage={product.image}
              productName={product.name} 
            />
          </div>

          {/* Product Info - Right Column (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-24 lg:h-fit space-y-4 sm:space-y-6">
            {/* Category Badge */}
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {product.categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-muted text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition"
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Section */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-4xl font-bold text-foreground">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm sm:text-lg text-muted-foreground line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs sm:text-sm font-semibold">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className={`text-xs sm:text-sm ${product.inStock ? 'text-green-600' : 'text-destructive'}`}>
                {product.inStock ? '✓ In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Key Highlights */}
            {quickHighlights.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wide">Quick Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickHighlights.map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 rounded-lg bg-background p-2.5 border border-border">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div className="text-xs sm:text-sm leading-snug">
                        <span className="font-semibold text-foreground">{key}: </span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Condition / Delivery Chips */}
            {(conditionText || inTheBoxText || osText || quantityEntry) && (
              <div className="flex flex-wrap gap-2">
                {conditionText && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-primary">
                    <Shield className="w-3.5 h-3.5" />
                    {conditionText}
                  </span>
                )}
                {inTheBoxText && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground">
                    <Package className="w-3.5 h-3.5" />
                    In box: {inTheBoxText}
                  </span>
                )}
                {osText && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground">
                    {osText}
                  </span>
                )}
                {quantityEntry && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground">
                    {quantityEntry[0]}: {quantityEntry[1]}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 h-9 py-0 sm:h-10 sm:py-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </Button>
              </div>

              </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </main>
  )
}
