import { NextResponse } from 'next/server'
import { listCategories } from '@/lib/server/category-store'
import { categories as fallbackCategories } from '@/lib/products'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('[api/categories] Falling back to static categories:', error)
    return NextResponse.json({ categories: fallbackCategories.filter((category) => category !== 'All') })
  }
}
