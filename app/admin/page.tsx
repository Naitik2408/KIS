'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { AdminStatsCard } from '@/components/admin-stats-card'
import type { Product } from '@/lib/products'
import { Package, TrendingUp, Star, AlertCircle, Shapes, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadError(null)

        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/products', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ])

        if (!productsRes.ok || !categoriesRes.ok) {
          const [productsError, categoriesError] = await Promise.all([
            productsRes.json().catch(() => ({})),
            categoriesRes.json().catch(() => ({})),
          ]) as Array<{ error?: string }>

          const productReason = productsError.error
            ? `/api/admin/products: ${productsRes.status} ${productsError.error}`
            : `/api/admin/products: ${productsRes.status}`
          const categoryReason = categoriesError.error
            ? `/api/categories: ${categoriesRes.status} ${categoriesError.error}`
            : `/api/categories: ${categoriesRes.status}`

          throw new Error(`${productReason} | ${categoryReason}`)
        }

        const productsData = (await productsRes.json()) as { products: Product[] }
        const categoriesData = (await categoriesRes.json()) as { categories: string[] }
        setProducts(productsData.products)
        setCategories(categoriesData.categories.filter((category) => category !== 'All'))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load admin dashboard data'
        console.error('[admin] Failed loading dashboard data', message)
        setLoadError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const totalProducts = products.length
  const inStockProducts = useMemo(
    () => products.filter((p) => p.inStock).length,
    [products]
  )
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).length,
    [products]
  )
  const totalCategories = categories.length

  const topCategory = useMemo(() => {
    if (categories.length === 0) {
      return 'No categories yet'
    }

    const categoryCounts = new Map<string, number>()
    products.forEach((product) => {
      product.categories.forEach((category) => {
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
      })
    })

    return Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .at(0)?.[0] ?? 'No categories yet'
  }, [categories, products])

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <AdminStatsCard
            title="Total Products"
            value={totalProducts}
            description="Products in catalog"
            icon={Package}
            color="primary"
          />
          <AdminStatsCard
            title="In Stock"
            value={inStockProducts}
            description={`${Math.round((inStockProducts / totalProducts) * 100)}% available`}
            icon={TrendingUp}
            color="green"
          />
          <AdminStatsCard
            title="Featured"
            value={featuredProducts}
            description="Featured products"
            icon={Star}
            color="blue"
          />
          <AdminStatsCard
            title="Categories"
            value={totalCategories}
            description={`Top category: ${topCategory}`}
            icon={Shapes}
            color="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(2,6,23,0.08)]">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link href="/admin/products">
              <Button className="w-full">View All Products</Button>
            </Link>
            <Link href="/admin/products?action=add">
              <Button variant="outline" className="w-full">
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full gap-2">
                Manage Categories
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity / Next Steps */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(2,6,23,0.08)]">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Next Steps
          </h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>
                Go to Products page to manage your catalog, add new products, or edit existing ones.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>
                Update product details, categories, pricing, and stock availability as needed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>
                Create and rename categories before assigning them to one or more products.
              </span>
            </li>
          </ul>
        </div>

        {/* Product Inventory Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(2,6,23,0.08)]">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Inventory Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-medium">Total Products</span>
              <span className="text-base sm:text-lg font-bold">{totalProducts}</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="font-medium">In Stock</span>
              <span className="text-base sm:text-lg font-bold text-green-600">{inStockProducts}</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="font-medium">Out of Stock</span>
              <span className="text-base sm:text-lg font-bold text-orange-600">
                {totalProducts - inStockProducts}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
              <span className="font-medium">Featured Items</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">{featuredProducts}</span>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="font-medium">Category Groups</span>
              <span className="text-base sm:text-lg font-bold text-indigo-600">{totalCategories}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
