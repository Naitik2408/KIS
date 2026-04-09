import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'
import { createCategory, deleteCategory, listCategories, renameCategory } from '@/lib/server/category-store'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

export async function GET() {
  const forbidden = await ensureAdmin()
  if (forbidden) {
    return forbidden
  }

  const categories = await listCategories()
  return NextResponse.json({ categories })
}

export async function POST(req: Request) {
  const forbidden = await ensureAdmin()
  if (forbidden) {
    return forbidden
  }

  const payload = (await req.json()) as { name?: string }
  if (!payload.name || !payload.name.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
  }

  try {
    const categories = await createCategory(payload.name)
    return NextResponse.json({ categories }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category'
    const status = message === 'Category name is required' ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(req: Request) {
  const forbidden = await ensureAdmin()
  if (forbidden) {
    return forbidden
  }

  const payload = (await req.json()) as { oldName?: string; newName?: string }
  if (!payload.oldName || !payload.oldName.trim() || !payload.newName || !payload.newName.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
  }

  try {
    const categories = await renameCategory(payload.oldName, payload.newName)
    return NextResponse.json({ categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to rename category'
    const status = message === 'Category not found' ? 404 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(req: Request) {
  const forbidden = await ensureAdmin()
  if (forbidden) {
    return forbidden
  }

  const payload = (await req.json()) as { name?: string }
  if (!payload.name || !payload.name.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
  }

  try {
    const categories = await deleteCategory(payload.name)
    return NextResponse.json({ categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete category'
    const status = message === 'Category is currently assigned to one or more products' ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
