'use client'

import { useEffect, useMemo, useState } from 'react'
import { Star, Quote } from 'lucide-react'

type GoogleReview = {
  author_name: string
  profile_photo_url?: string
  rating?: number
  relative_time_description?: string
  text: string
}

type ReviewsApiResponse = {
  reviews: GoogleReview[]
  source: 'google' | 'fallback'
}

type ReviewsApiErrorResponse = {
  error?: string
  status?: string
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const rating = review.rating ?? 5

  return (
    <article className="w-72.5 sm:w-85 min-h-50 shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.profile_photo_url ? (
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {review.author_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{review.author_name}</p>
            <p className="text-xs text-muted-foreground">{review.relative_time_description ?? 'recently'}</p>
          </div>
        </div>
        <Quote className="h-5 w-5 text-primary/60" />
      </div>

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`}
          />
        ))}
      </div>

      <p className="line-clamp-5 text-sm leading-relaxed text-muted-foreground">
        {review.text}
      </p>
    </article>
  )
}

function MarqueeRow({ reviews, reverse = false }: { reviews: GoogleReview[]; reverse?: boolean }) {
  const cards = [...reviews, ...reviews]

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 sm:gap-6 reviews-track ${reverse ? 'reviews-track-reverse' : ''}`}>
        {cards.map((review, index) => (
          <ReviewCard
            key={`${review.author_name}-${review.relative_time_description ?? 'time'}-${index}`}
            review={review}
          />
        ))}
      </div>
    </div>
  )
}

export function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Failed to load testimonials.')

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch('/api/google-reviews', { cache: 'no-store' })
        if (!res.ok) {
          const errorData = (await res.json().catch(() => ({}))) as ReviewsApiErrorResponse
          setErrorMessage(errorData.error || 'Failed to load testimonials.')
          setHasError(true)
          return
        }

        const data = (await res.json()) as ReviewsApiResponse
        if (!Array.isArray(data.reviews) || data.reviews.length === 0) {
          setErrorMessage('Failed to load testimonials.')
          setHasError(true)
          return
        }

        setReviews(data.reviews)
      } catch (error) {
        console.error('[reviews] Failed loading testimonials', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [])

  const normalizedReviews = useMemo(() => {
    if (reviews.length === 0) {
      return []
    }

    if (reviews.length >= 8) {
      return reviews
    }

    // Duplicate small sets so marquee rows feel full.
    return [...reviews, ...reviews, ...reviews].slice(0, 12)
  }, [reviews])

  const firstRow = normalizedReviews.filter((_, index) => index % 2 === 0)
  const secondRow = normalizedReviews.filter((_, index) => index % 2 === 1)

  if (isLoading) {
    return (
      <section className="relative py-16">
        <div className="px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Customer Testimonials</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Loading Google reviews...</p>
        </div>
      </section>
    )
  }

  if (hasError || normalizedReviews.length === 0) {
    return (
      <section className="relative py-16">
        <div className="px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Customer Testimonials</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{errorMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-16">
      <div className="mb-8 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Customer Testimonials</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Real feedback from Google Maps reviews shown in a live marquee feed.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-linear-to-r from-background to-transparent sm:block sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-linear-to-l from-background to-transparent sm:block sm:w-28" />

      <div>
        <div className="sm:hidden">
          <MarqueeRow reviews={normalizedReviews} />
        </div>

        <div className="hidden space-y-5 sm:block">
          <MarqueeRow reviews={firstRow} reverse />
          <MarqueeRow reviews={secondRow.length > 0 ? secondRow : firstRow} />
        </div>
      </div>
    </section>
  )
}
