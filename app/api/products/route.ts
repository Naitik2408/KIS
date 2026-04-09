import { NextResponse } from 'next/server'
import { listProducts } from '@/lib/server/product-store'
import { products as fallbackProducts } from '@/lib/products'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await listProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('[api/products] Falling back to static catalog:', error)
    return NextResponse.json({ products: fallbackProducts })
  }
}
