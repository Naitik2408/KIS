export interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  verified: boolean
  images?: string[]
}

export interface QAItem {
  id: string
  question: string
  asker: string
  answer?: string
  answerer?: string
  helpful: number
  date: string
}

export interface Product {
  id: string
  name: string
  categories: string[]
  price: number
  originalPrice?: number
  badge?: string
  image: string
  images?: string[]
  description: string
  specs?: {
    [key: string]: string
  }
  inStock: boolean
  featured?: boolean
  tags?: string[]
  customerReviews?: Review[]
  qaItems?: QAItem[]
  shippingInfo?: {
    estimatedDelivery: string
    freeShipping: boolean
    returnPolicy: string
  }
  warranty?: {
    duration: string
    coverage: string
  }
}

export const products: Product[] = [
  {
    id: '1',
    name: 'HP EliteBook 850 G8',
    categories: ['Laptops', 'Business'],
    price: 699.99,
    originalPrice: 799.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1588872657840-790ff3a58e39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516387938699-c52646db42da?w=800&h=600&fit=crop',
    ],
    description: [
      'HP ELITEBOOK 850 G8',
      'Intel Core i7, 8th Gen.',
      '16GB RAM | 256GB SSD',
      '15.6 FHD LED Screen',
      'Keyboard backlight',
      '2GB Dedicated Graphics Radeon 550X',
      'Intel integrated graphics',
      'Numeric keypad',
      'Win 10 Pro | With Adapter.',
      'Import A Grade Condition',
      'QTY AVAILABLE',
    ].join('\n'),
    specs: {
      'Processor': 'Intel Core i7 (8th Gen)',
      'RAM': '16GB',
      'Storage': '256GB SSD',
      'Display': '15.6 inch FHD LED',
      'Graphics': 'AMD Radeon 550X 2GB + Intel integrated graphics',
      'Keyboard': 'Backlit with numeric keypad',
      'Operating System': 'Windows 10 Pro',
      'In The Box': 'Laptop + Adapter',
      'Condition': 'Import A Grade',
      'QTY AVAILABLE': '12',
    },
    inStock: true,
    featured: true,
    tags: ['laptop', 'elitebook', 'business', 'refurbished', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
    customerReviews: [
      {
        id: 'r1',
        author: 'Aman Singh',
        rating: 5,
        title: 'Excellent condition and performance',
        content:
          'Laptop condition is genuinely A grade. Boot time is fast, keyboard feels premium, and display is sharp for daily work.',
        date: '1 week ago',
        helpful: 14,
        verified: true,
      },
      {
        id: 'r2',
        author: 'Neha Verma',
        rating: 4,
        title: 'Solid office laptop',
        content:
          'Very good for office tasks, browsing, and meetings. Battery backup is decent and numeric keypad is useful for accounting work.',
        date: '2 weeks ago',
        helpful: 9,
        verified: true,
      },
    ],
    qaItems: [
      {
        id: 'q1',
        question: 'Does it come with adapter and pre-installed Windows?',
        asker: 'Buyer101',
        answer: 'Yes, it includes an adapter and comes with Windows 10 Pro pre-installed.',
        answerer: 'Store Team',
        helpful: 12,
        date: '5 days ago',
      },
      {
        id: 'q2',
        question: 'Is there a dedicated graphics card?',
        asker: 'EditorPro',
        answer: 'Yes, it has Radeon 550X 2GB dedicated graphics along with Intel integrated graphics.',
        answerer: 'Store Team',
        helpful: 10,
        date: '3 days ago',
      },
    ],
  },
  {
    id: '2',
    name: 'Lenovo ThinkPad T14 Gen 2',
    categories: ['Laptops', 'Business'],
    price: 649.99,
    originalPrice: 749.99,
    badge: 'Top Pick',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=650&fit=crop',
    ],
    description:
      'Business-grade ThinkPad with reliable keyboard experience, durable build, and smooth performance for office, coding, and remote work.',
    specs: {
      'Processor': 'Intel Core i5 (11th Gen)',
      'RAM': '16GB DDR4',
      'Storage': '512GB NVMe SSD',
      'Display': '14 inch FHD IPS',
      'Graphics': 'Intel Iris Xe',
      'Condition': 'Import A Grade',
    },
    inStock: true,
    featured: true,
    tags: ['laptop', 'thinkpad', 'business', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
  },
  {
    id: '3',
    name: 'Dell Latitude 5420',
    categories: ['Laptops', 'Business'],
    price: 629.99,
    originalPrice: 719.99,
    image: 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=700&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1516387938699-c52646db42da?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=900&h=650&fit=crop',
    ],
    description:
      'Compact and dependable Dell Latitude for business users who need stable daily performance and great keyboard ergonomics.',
    specs: {
      'Processor': 'Intel Core i5 (11th Gen)',
      'RAM': '16GB DDR4',
      'Storage': '256GB SSD',
      'Display': '14 inch FHD',
      'Graphics': 'Intel UHD Graphics',
      'Condition': 'Import A Grade',
    },
    inStock: true,
    featured: false,
    tags: ['laptop', 'dell', 'latitude', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
  },
  {
    id: '4',
    name: 'ASUS VivoBook 15',
    categories: ['Laptops', 'Student', 'Office'],
    price: 589.99,
    originalPrice: 679.99,
    badge: 'Value Deal',
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=700&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=650&fit=crop',
    ],
    description:
      'Sleek VivoBook with modern design, backlit keyboard, and smooth multitasking for students and professionals.',
    specs: {
      'Processor': 'Intel Core i5 (10th Gen)',
      'RAM': '8GB DDR4',
      'Storage': '512GB SSD',
      'Display': '15.6 inch FHD',
      'Graphics': 'Intel UHD Graphics',
      'Condition': 'Import A Grade',
    },
    inStock: true,
    featured: true,
    tags: ['laptop', 'asus', 'vivobook', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
  },
  {
    id: '5',
    name: 'Acer TravelMate P2',
    categories: ['Laptops', 'Business'],
    price: 569.99,
    originalPrice: 639.99,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=700&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1522199710521-72d69614c702?w=900&h=650&fit=crop',
    ],
    description:
      'A practical laptop for office productivity with strong battery backup and a lightweight form factor.',
    specs: {
      'Processor': 'Intel Core i5 (10th Gen)',
      'RAM': '8GB DDR4',
      'Storage': '256GB SSD',
      'Display': '14 inch FHD',
      'Graphics': 'Intel UHD Graphics',
      'Condition': 'Import A Grade',
    },
    inStock: true,
    featured: false,
    tags: ['laptop', 'acer', 'travelmate', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
  },
  {
    id: '6',
    name: 'MSI Modern 14',
    categories: ['Laptops', 'Premium'],
    price: 679.99,
    originalPrice: 769.99,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=700&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1588872657840-790ff3a58e39?w=900&h=650&fit=crop',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=650&fit=crop',
    ],
    description:
      'Premium ultralight MSI laptop with sharp display and fast SSD performance for creators and power users.',
    specs: {
      'Processor': 'Intel Core i7 (11th Gen)',
      'RAM': '16GB DDR4',
      'Storage': '512GB NVMe SSD',
      'Display': '14 inch FHD IPS',
      'Graphics': 'Intel Iris Xe',
      'Condition': 'Import A Grade',
    },
    inStock: true,
    featured: true,
    tags: ['laptop', 'msi', 'modern', 'grade-a'],
    shippingInfo: {
      estimatedDelivery: 'Delivery in 2-4 business days',
      freeShipping: true,
      returnPolicy: '7-day replacement against functional defects',
    },
    warranty: {
      duration: '30 days checking warranty',
      coverage: 'Hardware functionality under standard usage',
    },
  },
]

export const categories = ['All', ...Array.from(new Set(products.flatMap((product) => product.categories)))].sort((a, b) => {
  if (a === 'All') return -1
  if (b === 'All') return 1
  return a.localeCompare(b)
})

export const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹700', min: 500, max: 700 },
  { label: '₹700 - ₹900', min: 700, max: 900 },
  { label: 'Over ₹900', min: 900, max: Infinity },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function filterProducts(filters: {
  category?: string
  priceRange?: { min: number; max: number }
  search?: string
}): Product[] {
  return products.filter((product) => {
    if (filters.category && filters.category !== 'All' && !product.categories.includes(filters.category)) {
      return false
    }
    if (filters.priceRange) {
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false
      }
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(searchLower)
      const matchesDescription = product.description.toLowerCase().includes(searchLower)
      const matchesCategory = product.categories.some((category) => category.toLowerCase().includes(searchLower))
      if (!matchesName && !matchesDescription && !matchesCategory) {
        return false
      }
    }
    return true
  })
}
