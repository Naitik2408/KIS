'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { AdminProductForm } from '@/components/admin-product-form'
import { Product } from '@/lib/products'
import { toast } from 'sonner'

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (product: Omit<Product, 'id'>) => {
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!res.ok) {
        throw new Error('Failed to create product')
      }

      router.push('/admin/products')
      toast.success('Product created successfully')
    } catch (error) {
      console.error('[admin] Error creating product:', error)
      toast.error('Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <AdminProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AdminLayout>
  )
}
