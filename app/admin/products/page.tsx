'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import type { Product } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Edit2, Trash2, Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function AdminProducts() {
  const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value)

  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load products')
        }

        const data = (await res.json()) as { products: Product[] }
        setLocalProducts(data.products)
      } catch (error) {
        console.error('[admin] Failed loading products', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter products based on search query
  const filteredProducts = localProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = async (productId: string) => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      console.error('[admin] Failed deleting product', productId)
      setDeleteConfirm(null)
      return
    }

    setLocalProducts(localProducts.filter((p) => p.id !== productId))
    setDeleteConfirm(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(2,6,23,0.06)]">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
            <Link href="/admin/products/add" className="sm:shrink-0">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading products...</div>
        )}

        {/* Products Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(2,6,23,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm line-clamp-2">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground break-all">ID: {product.id}</p>
                      </div>
                      <span className={`shrink-0 text-[11px] px-2 py-1 rounded-full font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-foreground">{formatINR(product.price)}</span>
                        {product.originalPrice && (
                          <p className="text-[11px] text-muted-foreground line-through">{formatINR(product.originalPrice)}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View product">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit product">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirm(product.id)}
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-muted-foreground">
              No products found matching your search.
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="hidden md:block rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-[0_14px_30px_rgba(2,6,23,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {product.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-foreground">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatINR(product.originalPrice)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              title="View product"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(product.id)}
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Info Box */}
        <div className="bg-linear-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-4">
          <p className="text-sm text-slate-700">
            <strong>Tip:</strong> Click the edit button to modify product details, or click the view button to see the product page.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
