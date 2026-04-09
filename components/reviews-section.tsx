'use client'

import { useState } from 'react'
import { Star, ThumbsUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Review } from '@/lib/products'

interface ReviewsSectionProps {
  reviews?: Review[]
  rating: number
  totalReviews: number
}

export function ReviewsSection({ reviews = [], rating, totalReviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('helpful')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const filteredReviews = filterRating 
    ? sortedReviews.filter(r => r.rating === filterRating)
    : sortedReviews

  const ratingDistribution = [5, 4, 3, 2, 1].map(rate => ({
    rating: rate,
    count: reviews.filter(r => r.rating === rate).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rate).length / reviews.length) * 100 : 0,
  }))

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews & Ratings</h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Overall Rating */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{rating.toFixed(1)}</span>
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating: rate, count, percentage }) => (
              <div key={rate} className="flex items-center gap-3">
                <button
                  onClick={() => setFilterRating(filterRating === rate ? null : rate)}
                  className="flex items-center gap-2 min-w-20 text-sm hover:text-primary transition"
                >
                  <span className="text-muted-foreground">{rate}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </button>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground min-w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 border-t pt-6 mb-6">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <article
                key={review.id}
                className="border-b pb-6 space-y-3"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{review.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">by {review.author}</span>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{review.date}</span>
                </div>

                {/* Review Content */}
                <p className="text-foreground text-sm leading-relaxed">{review.content}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border border-border cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{review.helpful}</span>
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {filterRating ? 'No reviews with this rating' : 'No reviews yet'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
