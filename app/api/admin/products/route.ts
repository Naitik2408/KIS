import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'
import { createProduct, listProducts, type ProductInput } from '@/lib/server/product-store'

export const runtime = 'nodejs'

function normalizeProductInput(input: Partial<ProductInput> & { category?: string; categories?: string[] }): ProductInput {
  const categories = Array.isArray(input.categories) && input.categories.length > 0
    ? input.categories
    : input.category
      ? [input.category]
      : []

  return {
    ...input,
    categories,
  } as ProductInput
}

function isValidProductInput(input: Partial<ProductInput>): input is ProductInput {
  const categories = Array.isArray((input as { categories?: unknown }).categories)
    ? ((input as { categories: unknown[] }).categories.filter((category) => typeof category === 'string' && category.trim().length > 0) as string[])
    : typeof (input as { category?: unknown }).category === 'string' && (input as { category?: string }).category?.trim().length
      ? [(input as { category: string }).category]
      : []

  return (
    typeof input.name === 'string' &&
    input.name.trim().length > 0 &&
    categories.length > 0 &&
    typeof input.price === 'number' &&
    Number.isFinite(input.price) &&
    typeof input.image === 'string' &&
    input.image.trim().length > 0 &&
    typeof input.description === 'string' &&
    input.description.trim().length > 0 &&
    typeof input.inStock === 'boolean'
  )
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const products = await listProducts()
  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = (await req.json()) as Partial<ProductInput>

  if (!isValidProductInput(payload)) {
    return NextResponse.json({ error: 'Invalid product payload' }, { status: 400 })
  }

  const created = await createProduct(normalizeProductInput(payload))
  return NextResponse.json({ product: created }, { status: 201 })
}
