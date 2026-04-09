'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { Product } from '@/lib/products'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load products')
        }

        const data = (await res.json()) as { products: Product[] }
        setProducts(data.products)
      } catch (error) {
        console.error('[search-modal] Failed loading products', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [open])

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      return products.slice(0, 12)
    }

    return products.filter((product) => {
      const inName = product.name.toLowerCase().includes(trimmed)
      const inCategories = product.categories.some((category) => category.toLowerCase().includes(trimmed))
      const inDescription = product.description.toLowerCase().includes(trimmed)

      return inName || inCategories || inDescription
    })
  }, [products, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-hidden">
        <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
            <DialogDescription>
              Find products by name, model, or category. Use Cmd+K or Ctrl+K to search anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 rounded-lg"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-3 py-3 sm:px-4">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading products...</div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onOpenChange(false)
                    router.push(`/products/${product.id}`)
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-left transition hover:border-primary/30 hover:bg-muted/40"
                >
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {product.categories.join(', ')}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No products found for "{query}"
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Tip: Use Cmd+K (or Ctrl+K) to open search quickly.
        </div>
      </DialogContent>
    </Dialog>
  )
}
