'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { BadgeCheck, Layers3, PencilLine, Plus, Shapes, Sparkles, Trash2 } from 'lucide-react'
import type { Product } from '@/lib/products'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/admin/categories', { cache: 'no-store' }),
          fetch('/api/admin/products', { cache: 'no-store' }),
        ])

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('Failed to load categories')
        }

        const categoriesData = (await categoriesRes.json()) as { categories: string[] }
        const productsData = (await productsRes.json()) as { products: Product[] }
        setCategories(categoriesData.categories)
        setProducts(productsData.products)
      } catch (error) {
        console.error('[admin] Failed loading categories', error)
        toast.error('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const usageMap = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach((product) => {
      product.categories.forEach((category) => {
        map.set(category, (map.get(category) || 0) + 1)
      })
    })
    return map
  }, [products])

  const categoriesOnly = categories.filter((category) => category !== 'All')
  const inUseCount = categoriesOnly.filter((category) => (usageMap.get(category) || 0) > 0).length
  const unusedCount = categoriesOnly.length - inUseCount

  const refreshCategories = async () => {
    const res = await fetch('/api/categories', { cache: 'no-store' })
    if (!res.ok) {
      throw new Error('Failed to refresh categories')
    }

    const data = (await res.json()) as { categories: string[] }
    setCategories(data.categories)
  }

  const handleCreate = async () => {
    const value = newCategory.trim()
    if (!value) {
      toast.error('Enter a category name first')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error || 'Failed to create category')
      }

      const data = (await res.json()) as { categories: string[] }
      setCategories(data.categories)
      setNewCategory('')
      setShowCreateForm(false)
      toast.success('Category created')
    } catch (error) {
      console.error('[admin] Failed creating category', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRename = async (oldName: string) => {
    const value = editingValue.trim()
    if (!value) {
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: value }),
      })

      if (!res.ok) {
        throw new Error('Failed to rename category')
      }

      const data = (await res.json()) as { categories: string[] }
      setCategories(data.categories)
      setEditingCategory(null)
      setEditingValue('')
      await refreshCategories()
      toast.success('Category renamed')
    } catch (error) {
      console.error('[admin] Failed renaming category', error)
      toast.error('Failed to rename category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (name: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error || 'Failed to delete category')
      }

      const data = (await res.json()) as { categories: string[] }
      setCategories(data.categories)
      toast.success('Category deleted')
    } catch (error) {
      console.error('[admin] Failed deleting category', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 sm:gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_16px_36px_rgba(2,6,23,0.08)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Category Library</h2>
                <p className="text-sm text-slate-500">Create, rename, and remove groups from one panel.</p>
              </div>
              <Button
                type="button"
                onClick={() => setShowCreateForm((prev) => !prev)}
                variant={showCreateForm ? 'outline' : 'default'}
                className="gap-2 rounded-xl w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                {showCreateForm ? 'Close' : 'Add Category'}
              </Button>
            </div>

            {showCreateForm && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-900">New Category</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a new category, e.g. Gaming"
                    className="bg-white"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleCreate} disabled={isSubmitting} className="gap-2 rounded-xl w-full sm:w-auto">
                      <Plus className="h-4 w-4" />
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl w-full sm:w-auto"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewCategory('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Loading categories...
              </div>
            ) : categoriesOnly.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center space-y-2">
                <Shapes className="mx-auto h-10 w-10 text-slate-400" />
                <p className="font-semibold text-slate-900">No categories yet</p>
                <p className="text-sm text-slate-500">Create your first category to start organizing products.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {categoriesOnly.map((category, index) => {
                  const usageCount = usageMap.get(category) || 0
                  const isEditing = editingCategory === category

                  return (
                    <div
                      key={category}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(2,6,23,0.05)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(2,6,23,0.09)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-indigo-500 text-white shadow-[0_10px_20px_rgba(8,145,178,0.24)]">
                            <span className="text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 text-base">{category}</h3>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                                {usageCount} products
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">
                              Products can be tagged with this category alongside others.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-xl w-full sm:w-auto"
                            onClick={() => {
                              setEditingCategory(category)
                              setEditingValue(category)
                            }}
                          >
                            <PencilLine className="h-4 w-4" />
                            Rename
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-xl text-destructive hover:text-destructive w-full sm:w-auto"
                            onClick={() => handleDelete(category)}
                            disabled={usageCount > 0 || isSubmitting}
                            title={usageCount > 0 ? 'Remove the category from products first' : 'Delete category'}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="bg-white rounded-xl" />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={() => handleRename(category)} disabled={isSubmitting || !editingValue.trim()} className="rounded-xl w-full sm:w-auto">
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl w-full sm:w-auto"
                              onClick={() => {
                                setEditingCategory(null)
                                setEditingValue('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_24px_rgba(2,6,23,0.07)]">
              <div className="flex items-center gap-2 mb-4">
                <Layers3 className="h-5 w-5 text-cyan-600" />
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">Rules</h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• One product can belong to multiple categories.</li>
                <li>• Rename keeps product assignments aligned.</li>
                <li>• Delete is disabled when a category is in use.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_24px_rgba(2,6,23,0.07)]">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Quick Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">Loaded categories</span>
                  <span className="text-lg font-bold text-slate-900">{categoriesOnly.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">In use</span>
                  <span className="text-lg font-bold text-emerald-700">{inUseCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">Unused</span>
                  <span className="text-lg font-bold text-amber-700">{unusedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
