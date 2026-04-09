'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
  images?: string[]
  mainImage?: string
  productName: string
}

export function ProductGallery({ images = [], mainImage, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Use provided images or fallback to mainImage
  const galleryImages = images && images.length > 0 ? images : [mainImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop']

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-4/3 lg:aspect-16/10 max-h-105 sm:max-h-130 bg-muted rounded-lg overflow-hidden group">
        <img
          src={galleryImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Navigation Buttons */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-3 left-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-10"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs sm:text-sm font-medium">
          {selectedIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition hover:opacity-80 ${
                selectedIndex === index
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
