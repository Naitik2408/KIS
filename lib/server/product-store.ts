import 'server-only'

import { randomUUID } from 'node:crypto'
import { products as seedProducts, type Product } from '@/lib/products'
import { connectToDatabase } from '@/lib/server/mongodb'
import { ProductModel } from '@/lib/server/models/product'
import { CategoryModel } from '@/lib/server/models/category'

let seeded = false

function normalizeProduct(product: Product | (Omit<Product, 'categories'> & { category?: string; categories?: string[] })): Product {
  if ('categories' in product && Array.isArray(product.categories)) {
    return {
      ...product,
      categories: product.categories.length > 0 ? product.categories : ['Uncategorized'],
    }
  }

  const legacyCategory = 'category' in product && typeof product.category === 'string' ? product.category : 'Uncategorized'

  return {
    ...(product as Omit<Product, 'categories'>),
    categories: [legacyCategory],
  }
}

async function ensureSeeded() {
  if (seeded) {
    return
  }

  await connectToDatabase()
  const count = await ProductModel.countDocuments()

  if (count === 0) {
    const normalizedSeedProducts = seedProducts.map(normalizeProduct)
    await ProductModel.insertMany(normalizedSeedProducts)
    await CategoryModel.insertMany(
      Array.from(new Set(normalizedSeedProducts.flatMap((product) => product.categories))).map((name) => ({ name })),
      { ordered: false }
    ).catch(() => undefined)
  }

  seeded = true
}

async function ensureCategoriesExist(categories: string[]) {
  if (categories.length === 0) {
    return
  }

  await Promise.all(
    categories.map((name) =>
      CategoryModel.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })
    )
  )
}

export async function listProducts(): Promise<Product[]> {
  await ensureSeeded()
  const items = await ProductModel.find().sort({ createdAt: -1 }).lean<Product[]>()
  return items.map(normalizeProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureSeeded()
  const item = await ProductModel.findOne({ id }).lean<Product | null>()
  return item ? normalizeProduct(item) : null
}

export type ProductInput = Omit<Product, 'id'>

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureSeeded()
  const normalized = normalizeProduct(input as Product)
  await ensureCategoriesExist(normalized.categories)

  const created: Product = {
    ...normalized,
    id: randomUUID(),
  }

  await ProductModel.create(created)
  return created
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  await ensureSeeded()
  const normalized = normalizeProduct(input as Product)
  await ensureCategoriesExist(normalized.categories)

  const updated: Product = {
    ...normalized,
    id,
  }

  const result = await ProductModel.findOneAndUpdate({ id }, updated, { new: true }).lean<Product | null>()
  return result ? normalizeProduct(result) : null
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSeeded()
  const result = await ProductModel.deleteOne({ id })
  return result.deletedCount === 1
}

export async function replaceCategoryInProducts(oldCategory: string, nextCategory: string): Promise<void> {
  await ensureSeeded()
  await ProductModel.updateMany(
    { categories: oldCategory },
    { $set: { 'categories.$[category]': nextCategory } },
    { arrayFilters: [{ category: oldCategory }] }
  )
}
