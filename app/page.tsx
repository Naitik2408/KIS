'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/hero-section'
import ProductCard from '@/components/product-card'
import { SearchModal } from '@/components/search-modal'
import { CartSidebar } from '@/components/cart-sidebar'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight, MessageCircle, PhoneCall, MapPin, ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/products'
import { GoogleReviewsSection } from '@/components/google-reviews-section'
import { LaptopBuyRentSection } from '@/components/laptop-buy-rent-section'
import { ContactHubSection } from '@/components/contact-hub-section'
import { TeamMembersSection } from '@/components/team-members-section'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([
    { id: 'all', label: 'All Products' },
  ])
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ])

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to load home catalog')
        }

        const productsData = (await productsRes.json()) as { products: Product[] }
        const categoriesData = (await categoriesRes.json()) as { categories: string[] }

        setProducts(productsData.products)
        setCategories([
          { id: 'all', label: 'All Products' },
          ...categoriesData.categories.map((category) => ({
            id: category.toLowerCase(),
            label: category,
          })),
        ])
      } catch (error) {
        console.error('[home] Failed to load catalog', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCatalog()
  }, [])

  const trendingProducts = products

  const filteredProducts = activeCategory === 'all'
    ? trendingProducts
    : trendingProducts.filter((p) => p.categories.some((category) => category.toLowerCase() === activeCategory))

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />

      {/* Trending Products */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">Available Laptops</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">Explore our growing laptop inventory with multiple business-ready models and clear specifications.</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-12 overflow-x-auto pb-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                <Skeleton className="aspect-4/3 w-full rounded-none" />
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-9 w-full rounded-lg" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <Empty className="border border-dashed border-border bg-card/60 py-16">
                <EmptyContent>
                  <EmptyTitle>No items available</EmptyTitle>
                  <EmptyDescription>
                    There are no laptops in this category right now. Please check back later or choose another filter.
                  </EmptyDescription>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </div>
      </section>

      <LaptopBuyRentSection />

      <GoogleReviewsSection />

      <TeamMembersSection />

      <ContactHubSection />

      {/* Footer */}
      <footer className="mt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto rounded-3xl border border-slate-800 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden shadow-2xl shadow-slate-950/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-800/90">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Krishna Infotech Solutions" className="w-11 h-11 rounded-xl object-cover" />
                <div>
                  <p className="text-lg font-bold leading-tight text-white">Krishna Infotech Solutions</p>
                  <p className="text-xs text-slate-400">Laptop Sale • Rental • Service</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Reliable laptop solutions for students, professionals, teams, and businesses with responsive local support from Kolkata.
              </p>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://wa.me/919060557296?text=Hi%20Krishna%20Infotech%20Solutions,%20I%20need%20laptop%20details."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-primary/60 hover:text-primary transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+919060557296"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-primary/60 hover:text-primary transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
            </div>

            <div className="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-800/90">
              <p className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-4">Quick Access</p>
              <div className="space-y-2">
                <a href="/products" className="group flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 hover:border-primary/60 transition">
                  Browse All Laptops
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </a>
                <a href="#rental" className="group flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 hover:border-primary/60 transition">
                  Rental Plans
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </a>
                <a href="#contact-hub" className="group flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 hover:border-primary/60 transition">
                  Contact Owner
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition" />
                </a>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <p className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-4">Visit Shop</p>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold mb-2 text-white">
                  <MapPin className="w-4 h-4 text-primary" />
                  Kolkata, West Bengal
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Entrance from, 1st floor, 1 Acharya Jagadish Chandra Bose Road, Lord Sinha Road, Kolkata, West Bengal 700020
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 px-6 sm:px-10 py-4 text-xs sm:text-sm text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>&copy; 2026 Krishna Infotech Solutions</p>
            <p>Built for fast laptop sale and rental support</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </main>
  )
}
