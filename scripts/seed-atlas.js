const mongoose = require('mongoose')

const uri = 'mongodb+srv://naitikkumar2408:OQxuoWBqAHdDNXOm@cluster0.2olj0au.mongodb.net/?appName=Cluster0'
const dbName = 'krishna_store'

const products = [
  {
    id: '176b9d06-7d0f-46c3-90ae-29b10e385324',
    name: 'HP ZBOOK FIRE FLY G8',
    categories: ['Laptops'],
    price: 56999,
    originalPrice: 64999,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=650&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=650&fit=crop',
    ],
    description:
      'HP ZBOOK FIRE FLY G8\nIntel Core i5 11th Gen.\n8GB RAM | 256GB SSD\n14.4 FHD LED Screen\nIris Intel Graphics\nWin 10 Pro | With Adapter.\nImport A Grade Condition\nQTY AVAILABLE',
    specs: {
      Processor: 'Intel Core i5 (11th Gen)',
      RAM: '8GB',
      Storage: '256GB SSD',
      Display: '14.4 FHD LED Screen',
      Graphics: 'Intel Iris Graphics',
      'Operating System': 'Windows 10 Pro',
      'In The Box': 'Laptop + Adapter',
      Condition: 'Import A Grade Condition',
      'QTY AVAILABLE': 'Available',
    },
    inStock: true,
    featured: false,
    tags: ['laptop', 'hp', 'zbook', 'grade-a'],
  },
  {
    id: '7c2ac3ba-9a1b-4658-a072-d3b3b08dd48e',
    name: 'HP ELITEBOOK 850 G8',
    categories: ['Laptops'],
    price: 62999,
    originalPrice: 72999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=650&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1588872657840-790ff3a58e39?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1516387938699-c52646db42da?w=900&h=650&fit=crop',
    ],
    description:
      'HP ELITEBOOK 850 G8\nIntel Core i7, 8th Gen.\n16GB RAM | 256GB SSD\n15.6 FHD LED Screen\nKeyboard backlight\n2GB Dedicated Graphics Radeon 550X\nIntel integrated graphics\nNumerical keypad\nWin 10 Pro | With Adapter.\nImport A Grade Condition\nQTY AVAILABLE',
    specs: {
      Processor: 'Intel Core i7 (8th Gen)',
      RAM: '16GB',
      Storage: '256GB SSD',
      Display: '15.6 FHD LED Screen',
      Graphics: 'Radeon 550X 2GB + Intel integrated',
      Keyboard: 'Backlit + Numerical keypad',
      'Operating System': 'Windows 10 Pro',
      'In The Box': 'Laptop + Adapter',
      Condition: 'Import A Grade Condition',
      'QTY AVAILABLE': 'Available',
    },
    inStock: true,
    featured: true,
    tags: ['laptop', 'hp', 'elitebook', 'grade-a'],
  },
  {
    id: 'f8ad2583-4a86-4741-8ddc-998a4d5f8119',
    name: 'DELL LATITUDE 5410',
    categories: ['Laptops'],
    price: 42999,
    originalPrice: 49999,
    image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=900&h=650&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1516387938699-c52646db42da?w=900&h=650&fit=crop',
    ],
    description:
      'DELL LATITUDE 5410\nIntel Core i5 10th Gen.\n8GB RAM | 256GB SSD\n14.4 FHD LED Screen\nWin 10 Pro | With Adapter.\nImport A Grade Condition\nQTY AVAILABLE',
    specs: {
      Processor: 'Intel Core i5 (10th Gen)',
      RAM: '8GB',
      Storage: '256GB SSD',
      Display: '14.4 FHD LED Screen',
      Graphics: 'Intel UHD Graphics',
      'Operating System': 'Windows 10 Pro',
      'In The Box': 'Laptop + Adapter',
      Condition: 'Import A Grade Condition',
      'QTY AVAILABLE': 'Available',
    },
    inStock: true,
    featured: false,
    tags: ['laptop', 'dell', 'latitude', 'grade-a'],
  },
]

async function main() {
  await mongoose.connect(uri, { dbName })
  const db = mongoose.connection.db
  const now = new Date()

  await db.collection('categories').updateOne(
    { name: 'Laptops' },
    { $set: { name: 'Laptops', updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  )

  for (const product of products) {
    await db.collection('products').updateOne(
      { id: product.id },
      { $set: { ...product, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    )
  }

  const productCount = await db.collection('products').countDocuments({
    id: { $in: products.map((p) => p.id) },
  })
  const hasCategory = await db.collection('categories').findOne({ name: 'Laptops' })

  console.log(`Upserted products found: ${productCount}`)
  console.log(`Category exists: ${Boolean(hasCategory)}`)
  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error('Atlas upsert failed:', error)
  try {
    await mongoose.disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})
