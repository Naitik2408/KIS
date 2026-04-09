import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'
import { deleteProduct, getProductById, type ProductInput, updateProduct } from '@/lib/server/product-store'

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

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const product = await getProductById(id)

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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

  const { id } = await context.params
  const updated = await updateProduct(id, normalizeProductInput(payload))

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product: updated })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const deleted = await deleteProduct(id)

  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
