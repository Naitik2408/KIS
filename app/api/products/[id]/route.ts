import { NextResponse } from 'next/server'
import { getProductById } from '@/lib/server/product-store'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const product = await getProductById(id)

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}
