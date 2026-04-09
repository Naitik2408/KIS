import { NextResponse } from 'next/server'
import { getProductById } from '@/lib/server/product-store'
import { getProductById as getFallbackProductById } from '@/lib/products'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  let product = null

  try {
    product = await getProductById(id)
  } catch (error) {
    console.error('[api/products/:id] Falling back to static catalog:', error)
    product = getFallbackProductById(id) ?? null
  }

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}
