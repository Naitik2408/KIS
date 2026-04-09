'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type HeroSectionProps = {
  onSearchOpen: () => void
  onCartOpen: () => void
}

export default function HeroSection({ onSearchOpen, onCartOpen }: HeroSectionProps) {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&h=1080&fit=crop',
      alt: 'Premium laptop setup on a modern desk',
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=1080&fit=crop',
      alt: 'High-end electronics workspace',
    },
    {
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
      alt: 'Creative professional tech environment',
    },
    {
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1920&h=1080&fit=crop',
      alt: 'Modern smartphone and accessories collection',
    },
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const goToPrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/35 to-black/60" />

      <div className="relative z-20">
        <Navigation onCartOpen={onCartOpen} overlay />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 border border-white/30 mb-6 sm:mb-8 lg:mb-10 backdrop-blur-sm hover:bg-white/15 transition-colors">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[11px] sm:text-sm text-white font-medium">Established 2020 • Kolkata</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold tracking-tighter text-white mb-4 sm:mb-5 lg:mb-6 leading-tight text-balance drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            <span className="bg-linear-to-r from-white via-slate-100 to-primary-foreground bg-clip-text text-transparent">
              Krishna Infotech Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-relaxed text-balance font-light">
            Welcome to our shop, where our passion for technology meets our dedication to exceptional customer service. Since 2020, we have served the community with reliable and high-quality laptop sale, rental, and services.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 lg:mb-20">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
              <Link href="/products">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={goToPrev}
          className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/40 bg-black/35 text-white items-center justify-center hover:bg-black/55 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={goToNext}
          className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/40 bg-black/35 text-white items-center justify-center hover:bg-black/55 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
