'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { AdminProductForm } from '@/components/admin-product-form'
import { Product } from '@/lib/products'
import { toast } from 'sonner'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      const productId = params?.id as string

      try {
        const res = await fetch(`/api/admin/products/${productId}`, {
          cache: 'no-store',
        })

        if (!res.ok) {
          router.push('/admin/products')
          return
        }

        const data = (await res.json()) as { product: Product }
        setProduct(data.product)
      } catch (error) {
        console.error('[admin] Failed loading product', error)
        router.push('/admin/products')
      }
    }

    loadProduct()
  }, [params, router])

  const handleSubmit = async (updatedProduct: Omit<Product, 'id'>) => {
    setIsLoading(true)
    
    try {
      const productId = params?.id as string
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })

      if (!res.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/admin/products')
      toast.success('Product updated successfully')
    } catch (error) {
      console.error('[admin] Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminProductForm product={product} onSubmit={handleSubmit} isLoading={isLoading} />
    </AdminLayout>
  )
}
