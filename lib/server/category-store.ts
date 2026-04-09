import 'server-only'

import { products as seedProducts } from '@/lib/products'
import { connectToDatabase } from '@/lib/server/mongodb'
import { CategoryModel } from '@/lib/server/models/category'
import { ProductModel } from '@/lib/server/models/product'
import { replaceCategoryInProducts } from '@/lib/server/product-store'

let seeded = false

function normalizeCategory(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeCategory).filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

async function ensureCategories(): Promise<string[]> {
  await connectToDatabase()

  if (!seeded) {
    const count = await CategoryModel.countDocuments()
    if (count === 0) {
      const seedCategoryNames = uniqueSorted(seedProducts.flatMap((product) => product.categories))
      if (seedCategoryNames.length > 0) {
        await CategoryModel.insertMany(seedCategoryNames.map((name) => ({ name })), { ordered: false }).catch(() => undefined)
      }
    }
    seeded = true
  }

  const categories = await CategoryModel.find().sort({ name: 1 }).lean<Array<{ name: string }>>()
  return uniqueSorted(categories.map((category) => category.name))
}

export async function listCategories(): Promise<string[]> {
  return ensureCategories()
}

export async function createCategory(name: string): Promise<string[]> {
  await ensureCategories()
  const nextName = normalizeCategory(name)

  if (!nextName) {
    throw new Error('Category name is required')
  }

  const escaped = escapeRegex(nextName)
  const existing = await CategoryModel.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } }).lean()
  if (existing) {
    return ensureCategories()
  }

  await CategoryModel.updateOne({ name: nextName }, { $setOnInsert: { name: nextName } }, { upsert: true })
  return ensureCategories()
}

export async function renameCategory(oldName: string, newName: string): Promise<string[]> {
  const categories = await ensureCategories()
  const normalizedOld = normalizeCategory(oldName)
  const normalizedNext = normalizeCategory(newName)

  if (!normalizedOld || !normalizedNext) {
    throw new Error('Category name is required')
  }

  const existingIndex = categories.findIndex((category) => category.toLowerCase() === normalizedOld.toLowerCase())
  if (existingIndex === -1) {
    throw new Error('Category not found')
  }

  const escapedOld = escapeRegex(normalizedOld)
  await CategoryModel.updateOne(
    { name: { $regex: `^${escapedOld}$`, $options: 'i' } },
    { $set: { name: normalizedNext } }
  )
  await replaceCategoryInProducts(normalizedOld, normalizedNext)
  return ensureCategories()
}

export async function deleteCategory(name: string): Promise<string[]> {
  const categories = await ensureCategories()
  const normalizedName = normalizeCategory(name)

  if (!normalizedName) {
    throw new Error('Category name is required')
  }

  const inUse = await ProductModel.exists({ categories: normalizedName })
  if (inUse) {
    const error = new Error('Category is currently assigned to one or more products')
    error.name = 'CategoryInUseError'
    throw error
  }

  const escapedName = escapeRegex(normalizedName)
  await CategoryModel.deleteOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } })
  return ensureCategories()
}
