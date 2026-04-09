'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type Product } from '@/lib/products'
import Navigation from '@/components/navigation'
import { ProductFilters } from '@/components/product-filters'
import { ProductGrid } from '@/components/product-grid'
import { SearchModal } from '@/components/search-modal'
import { CartSidebar } from '@/components/cart-sidebar'
import { LayoutGrid, LayoutList } from 'lucide-react'

type SortOption = 'price-low' | 'price-high'

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

const DEFAULT_SORT: SortOption = 'price-low'

export default function ProductsPageClient() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get('category') ?? 'All'
  const selectedSort = searchParams.get('sort') === 'price-high' ? 'price-high' : DEFAULT_SORT

  const updateQueryParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'All') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load products')
        }

        const data = (await res.json()) as { products: Product[] }
        setAllProducts(data.products)
      } catch (error) {
        console.error('[products] Failed loading products', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const result = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.categories.includes(selectedCategory)
      return matchesCategory
    })

    let sorted = result

    if (selectedSort === 'price-low') {
      sorted = [...sorted].sort((a, b) => a.price - b.price)
    } else {
      sorted = [...sorted].sort((a, b) => b.price - a.price)
    }

    return sorted
  }, [allProducts, selectedCategory, selectedSort])

  const handleCategoryChange = (category: string) => {
    updateQueryParams({ category })
  }

  const handleResetFilters = () => {
    updateQueryParams({ category: null, price: null })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation onCartOpen={() => setCartOpen(true)} />

      <div className="border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredProducts.length} of {allProducts.length} products
              </p>
              {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading products...</p>}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSort}
                onChange={(e) => {
                  updateQueryParams({ sort: e.target.value })
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${
                    viewMode === 'list'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              <ProductFilters
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onReset={handleResetFilters}
                onOpenSearchModal={() => setSearchOpen(true)}
              />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </main>
  )
}