'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Product, categories as fallbackCategories } from '@/lib/products'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface AdminProductFormProps {
  product?: Product
  onSubmit?: (product: Omit<Product, 'id'>) => void | Promise<void>
  isLoading?: boolean
}

const DEFAULT_SPEC_KEYS = [
  'Processor',
  'RAM',
  'Storage',
  'Display',
  'Graphics',
  'Keyboard',
  'Operating System',
  'In The Box',
  'Condition',
  'QTY AVAILABLE',
]

function buildSpecsWithDefaults(source: Record<string, string> = {}): Record<string, string> {
  const base = Object.fromEntries(DEFAULT_SPEC_KEYS.map((key) => [key, ''])) as Record<string, string>
  return {
    ...base,
    ...source,
  }
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  categories: [],
  price: 0,
  originalPrice: undefined,
  image: '',
  description: '',
  inStock: true,
  featured: false,
  specs: {},
  images: [],
  tags: [],
}

const HP_ELITEBOOK_DESCRIPTION_TEMPLATE = [
  'HP ELITEBOOK 850 G8',
  'Intel Core i7, 8th Gen.',
  '16GB RAM | 256GB SSD',
  '15.6 FHD LED Screen',
  'Keyboard backlight',
  '2GB Dedicated Graphics Radeon 550X',
  'Intel integrated graphics',
  'Numeric keypad',
  'Win 10 Pro | With Adapter.',
  'Import A Grade Condition',
  'QTY AVAILABLE',
].join('\n')

const HP_ELITEBOOK_SPECS_TEMPLATE: Record<string, string> = {
  Processor: 'Intel Core i7 (8th Gen)',
  RAM: '16GB',
  Storage: '256GB SSD',
  Display: '15.6 FHD LED Screen',
  Graphics: 'Radeon 550X 2GB dedicated + Intel integrated',
  Keyboard: 'Backlit + Numeric keypad',
  'Operating System': 'Windows 10 Pro',
  'In The Box': 'Laptop + Adapter',
  Condition: 'Import A Grade Condition',
  'QTY AVAILABLE': 'Available',
}

export function AdminProductForm({
  product,
  onSubmit,
  isLoading = false,
}: AdminProductFormProps) {
  const initialProduct = product ?? EMPTY_PRODUCT
  const [formData, setFormData] = useState<Partial<Product>>(
    initialProduct
  )

  const [specs, setSpecs] = useState<Record<string, string>>(
    buildSpecsWithDefaults(initialProduct.specs || {})
  )

  const [availableCategories, setAvailableCategories] = useState<string[]>(
    fallbackCategories.filter((category) => category !== 'All')
  )
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<Array<{ previewUrl: string; file: File }>>([])
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const uploadInputId = 'admin-product-image-upload'

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load categories')
        }

        const data = (await res.json()) as { categories: string[] }
        setAvailableCategories(data.categories)
      } catch (error) {
        console.error('[admin] Failed loading categories', error)
      }
    }

    loadCategories()
  }, [])

  const selectedCategories = Array.isArray(formData.categories) ? formData.categories : []

  useEffect(() => {
    return () => {
      pendingUploads.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [pendingUploads])

  const uploadImagesToCloudinary = async (files: File[]) => {
    const payload = new FormData()
    files.forEach((file) => payload.append('files', file))

    const response = await fetch('/api/admin/uploads/images', {
      method: 'POST',
      body: payload,
    })

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => ({}))) as {
        error?: string
        details?: string[]
      }

      const details = Array.isArray(errorPayload.details) && errorPayload.details.length > 0
        ? ` Missing: ${errorPayload.details.join(', ')}`
        : ''

      throw new Error((errorPayload.error || `Cloudinary upload failed (${response.status})`) + details)
    }

    const data = (await response.json()) as { images?: string[] }
    return data.images || []
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (['price', 'originalPrice'].includes(name)) {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const toggleCategory = (category: string) => {
    setFormData((current) => {
      const currentCategories = Array.isArray(current.categories) ? current.categories : []
      const nextCategories = currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category]

      return {
        ...current,
        categories: nextCategories,
      }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) {
      return
    }

    try {
      const newPendingUploads = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))

      setPendingUploads((current) => [...current, ...newPendingUploads])

      setFormData((current) => {
        const nextImages = [...(current.images || []), ...newPendingUploads.map((item) => item.previewUrl)].filter(Boolean)
        const nextPrimaryImage = current.image || nextImages[0] || ''

        return {
          ...current,
          image: nextPrimaryImage,
          images: Array.from(new Set(nextImages)),
        }
      })
    } catch (error) {
      console.error('[admin] Failed uploading images', error)
      alert('Failed to prepare images for upload.')
    } finally {
      e.target.value = ''
    }
  }

  const removeImage = (imageToRemove: string) => {
    const pendingMatch = pendingUploads.find((item) => item.previewUrl === imageToRemove)
    if (pendingMatch) {
      URL.revokeObjectURL(pendingMatch.previewUrl)
      setPendingUploads((current) => current.filter((item) => item.previewUrl !== imageToRemove))
    }

    setFormData((current) => {
      const remainingImages = (current.images || []).filter((image) => image !== imageToRemove)
      const nextPrimaryImage = current.image === imageToRemove
        ? remainingImages[0] || ''
        : current.image || remainingImages[0] || ''

      return {
        ...current,
        image: nextPrimaryImage,
        images: remainingImages,
      }
    })
  }

  const setPrimaryImage = (imageToUse: string) => {
    setFormData((current) => ({
      ...current,
      image: imageToUse,
      images: [imageToUse, ...((current.images || []).filter((image) => image !== imageToUse))],
    }))
  }

  const handleSpecChange = (specName: string, value: string) => {
    setSpecs((current) => ({ ...current, [specName]: value }))
  }

  const applyHpTemplate = () => {
    setFormData((current) => ({
      ...current,
      description: HP_ELITEBOOK_DESCRIPTION_TEMPLATE,
    }))
    setSpecs((current) => ({
      ...HP_ELITEBOOK_SPECS_TEMPLATE,
      ...current,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedSpecs = Object.fromEntries(
      Object.entries(specs).filter(([key, value]) => key.trim().length > 0 && value.trim().length > 0)
    )
    
    const selectedImageRefs = Array.from(new Set([...(formData.images || []), ...(formData.image ? [formData.image] : [])]))
    const pendingToUpload = pendingUploads.filter((item) => selectedImageRefs.includes(item.previewUrl))
    const uploadedMap = new Map<string, string>()

    if (pendingToUpload.length > 0) {
      try {
        setIsUploadingImages(true)
        const uploadedImages = await uploadImagesToCloudinary(pendingToUpload.map((item) => item.file))
        pendingToUpload.forEach((item, index) => {
          const uploaded = uploadedImages[index]
          if (uploaded) {
            uploadedMap.set(item.previewUrl, uploaded)
          }
        })
      } catch (error) {
        console.error('[admin] Failed uploading images', error)
        const message = error instanceof Error ? error.message : 'Image upload failed. Please verify Cloudinary setup and try again.'
        alert(message)
        setIsUploadingImages(false)
        return
      }
      setIsUploadingImages(false)
    }

    const resolvedImages = selectedImageRefs
      .map((image) => uploadedMap.get(image) || image)
      .filter(Boolean)

    const primarySource = formData.image || resolvedImages[0] || ''
    const resolvedPrimaryImage = (primarySource ? uploadedMap.get(primarySource) || primarySource : '') || resolvedImages[0] || ''

    const updatedProduct: Omit<Product, 'id'> = {
      name: formData.name || '',
      categories: selectedCategories,
      price: formData.price || 0,
      originalPrice: formData.originalPrice,
      image: resolvedPrimaryImage,
      description: formData.description || '',
      inStock: Boolean(formData.inStock),
      featured: Boolean(formData.featured),
      specs: cleanedSpecs,
      tags: formData.tags || [],
      images: Array.from(new Set(resolvedImages)),
      customerReviews: formData.customerReviews,
      qaItems: formData.qaItems,
      shippingInfo: formData.shippingInfo,
      warranty: formData.warranty,
    }

    await onSubmit?.(updatedProduct)
    console.log('[v0] Product submitted:', updatedProduct)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="hidden gap-2 w-full sm:inline-flex sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5 shadow-[0_12px_28px_rgba(2,6,23,0.07)]">
            <h2 className="text-base sm:text-lg font-semibold">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Images</label>
                  <p className="text-xs text-slate-500">
                    Upload one or more images from your computer. The first image becomes the primary image.
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {(formData.images?.length || 0) + (formData.image ? 1 : 0)} selected
                </div>
              </div>

              <label
                htmlFor={uploadInputId}
                className="group block cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-8 sm:px-6 sm:py-10 text-center shadow-[0_10px_28px_rgba(2,6,23,0.06)] transition duration-200 hover:border-cyan-400 hover:bg-cyan-50/40">
                  <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.10),transparent_30%)]" />
                  <div className="relative mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-linear-to-br from-slate-900 to-slate-700 text-white shadow-[0_16px_30px_rgba(2,6,23,0.22)] transition group-hover:scale-105">
                    <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <p className="relative mt-4 sm:mt-5 text-base sm:text-lg font-semibold text-slate-900">Upload image</p>
                  <p className="relative mt-2 text-xs sm:text-sm text-slate-500 px-2 sm:px-0">
                    Click to browse or drop product photos here. Files upload to Cloudinary only after you save the product.
                  </p>
                  <div className="relative mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] sm:text-xs font-medium text-slate-600 shadow-sm">
                    JPG, PNG, WEBP
                  </div>
                </div>
              </label>

              <input
                id={uploadInputId}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
              />

              {isUploadingImages && (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs sm:text-sm text-cyan-800">
                  Uploading selected images to Cloudinary...
                </div>
              )}

              {(formData.images?.length || formData.image) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {Array.from(new Set([...(formData.images || []), ...(formData.image ? [formData.image] : [])])).map((image) => {
                    const isPrimary = formData.image === image

                    return (
                      <div key={image} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(2,6,23,0.06)] transition hover:-translate-y-0.5">
                        <img src={image} alt={formData.name || 'Product image'} className="h-28 sm:h-40 w-full object-cover" />
                        <div className="absolute left-2 top-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                          {isPrimary ? 'Primary' : 'Gallery'}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2 bg-linear-to-t from-black/75 via-black/35 to-transparent p-2">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(image)}
                            className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-white/25"
                          >
                            Set primary
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-white/25"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:p-6 text-center text-xs sm:text-sm text-slate-500">
                  Your uploaded images will appear here.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categories</label>
              <p className="text-xs text-muted-foreground mb-3">
                A product can belong to more than one category, for example Laptops and Gaming.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableCategories.map((category) => {
                  const checked = selectedCategories.includes(category)

                  return (
                    <label
                      key={category}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm transition cursor-pointer ${
                        checked
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span>{category}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </label>
                  )
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <span key={category} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                    {category}
                    <button type="button" onClick={() => toggleCategory(category)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium">Description</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyHpTemplate}
                >
                  Insert HP Details
                </Button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description (multi-line supported)"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-[0_12px_28px_rgba(2,6,23,0.07)]">
            <h2 className="text-base sm:text-lg font-semibold">Pricing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (INR)</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Original Price (INR)</label>
                <Input
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ''}
                  onChange={handleChange}
                  placeholder="0.00 (optional)"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-[0_12px_28px_rgba(2,6,23,0.07)]">
            <h2 className="text-base sm:text-lg font-semibold">Specifications</h2>

            <div className="space-y-3">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    value={key}
                    placeholder="Spec name"
                    disabled
                    className="w-full sm:flex-1"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleSpecChange(key, e.target.value)}
                    placeholder="Spec value"
                    className="w-full sm:flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const newSpecs = { ...specs }
                      delete newSpecs[key]
                      setSpecs(newSpecs)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="New spec key, e.g. Battery"
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="New spec value, e.g. 6-cell"
              />
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const nextKey = newSpecKey.trim()
                  if (!nextKey) {
                    return
                  }

                  setSpecs((current) => ({ ...current, [nextKey]: newSpecValue.trim() }))
                  setNewSpecKey('')
                  setNewSpecValue('')
                }}
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Add Specification
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-5 sm:space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-[0_12px_28px_rgba(2,6,23,0.07)]">
            <h2 className="text-base sm:text-lg font-semibold">Status</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
          </div>

          {/* Preview */}
          {(formData.image || formData.images?.length) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_12px_28px_rgba(2,6,23,0.07)]">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Image Preview</h2>
              <img
                src={formData.image || formData.images?.[0] || ''}
                alt={formData.name || 'Product preview'}
                className="w-full h-40 sm:h-56 object-cover rounded-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
