'use client'

import * as React from 'react'
import { Filter, Search, Tag, RotateCcw } from 'lucide-react'

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onReset?: () => void
  onOpenSearchModal?: () => void
}

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  onReset,
  onOpenSearchModal,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [availableCategories, setAvailableCategories] = React.useState<string[]>([])

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load categories')
        }

        const data = (await res.json()) as { categories: string[] }
        setAvailableCategories(data.categories)
      } catch (error) {
        console.error('[filters] Failed to load categories', error)
      }
    }

    loadCategories()
  }, [])

  const handleReset = () => {
    onReset?.()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-5 shadow-sm space-y-4 sm:space-y-5">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition text-xs font-medium"
        >
          <Filter className="w-4 h-4" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        {selectedCategory !== 'All' && (
          <button
            onClick={handleReset}
            className="text-sm text-primary hover:text-primary/80 transition inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Container */}
      <div
        className={`space-y-5 sm:space-y-6 ${
          isOpen ? 'block' : 'hidden md:block'
        }`}
      >
        {/* Search */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground inline-flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            Search
          </label>
          <button
            type="button"
            onClick={() => onOpenSearchModal?.()}
            className="w-full flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition"
          >
            <Search className="w-4 h-4" />
            Search by model or keyword
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground inline-flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Category
          </label>
          <div className="grid grid-cols-1 gap-2">
            {['All', ...availableCategories].map((category: string) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category)
                }}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm transition border ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background border-border hover:border-primary/30 hover:bg-muted/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
