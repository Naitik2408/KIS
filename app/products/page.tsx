import { Suspense } from 'react'
import ProductsPageClient from './products-page-client'

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsPageClient />
    </Suspense>
  )
}
