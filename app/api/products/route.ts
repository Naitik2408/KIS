import { NextResponse } from 'next/server'
import { listProducts } from '@/lib/server/product-store'

export const runtime = 'nodejs'

export async function GET() {
  const products = await listProducts()
  return NextResponse.json({ products })
}
